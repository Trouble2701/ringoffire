import { inject, Injectable } from '@angular/core';
import { collection, Firestore, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, where, limit, orderBy } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class Game {
    /**Spiele Daten */
    players: string[] = [];
    playerGender: string[] = [];
    stack: string[] = [];
    playedCards: string[] = [];
    currentPlayer: number = 0;
    gameIsRun: boolean = false;
    Datenow: number = 0;
    timeJet: number;
    allGames: any[] = [];
    allGamesID: any[] = [];
    currentCardDB?:any = '';

    /**Gesuchte Spiele */
    findGame: any[] = [];

    /**Daten während Des Spiels */
    alertNumber: number = 1;
    newTitleDB?: string;
    newDisDB?: string;

    /**Spiele Optionen*/
    allCards?: any;
    dontShow = true;
    endOfGame = false;

    /**Spiele ID */
    gameID: string;

    /**Firestore */
    firestore: Firestore = inject(Firestore);

    cardAction = [
        { title: 'Wasserfall', discription: 'Das Ass steht für den Wasserfall. Alle Spieler setzen zum trinken an. Im Uhrzeigersinn darf erst dann mit dem Trinken aufgehört werden, wenn der rechte Sitznachbar davor seinen Wasserfall beendet hat. Der Spieler, der das Ass zieht darf zu erst aufhören zu trinken (wann er will).' },
        { title: 'Du', discription: 'Du darfst eine Person bestimmen, die einen Schluck aus ihrem Getränk nimmt..' },
        { title: 'Ich', discription: 'Du musst einen Schluck trinken.' },
        { title: 'Boden', discription: 'Berühre mit deiner Hand den Boden. Der Mitspieler, der zuletzt den Boden berührt, muss einen Schluck trinken.' },
        { title: 'Daumen', discription: 'Berühre mit deinem Daumen die Tischplatte. Der Mitspieler der zuletzt den Tisch berührt, muss einen Schluck trinken.' },
        { title: 'Frauenrunde', discription: 'Die Damen der Schöpfung müssen einen Schluck trinken.' },
        { title: 'Himmel', discription: 'Zeige mit deinem Zeigefinger gen Himmel. Wer zuletzt zum Himmel zeigt, muss einen Schluck trinken.' },
        { title: 'Mit Trinken', discription: 'Bestimme einen Mitspieler, der von nun an jedes Mal mit dir einen Schluck trinken muss, wenn du dazu aufgefordert wirst.' },
        { title: 'Reim', discription: 'Such dir ein Wort aus. Im Uhrzeigersinn müssen die Mitspieler einen Reim darauf finden. Wer ein Wort wiederholt oder keinen neuen Reim mehr nennen kann, muss einen Schluck trinken.' },
        { title: 'Männerrunde', discription: 'Die Männer dürfen anstoßen und einen Schluck trinken.' },
        { title: 'Neue Regel', discription: 'Die Person, die einen Buben zieht, darf sich eine neue Spielregel ausdenken, die bis zum Ende des Spiels gilt. Die Regel darf keine anderen außer Kraft setzen.' },
        { title: 'Ausruf', discription: 'Der Spieler darf eine Runde "Never have I ever..." ausrufen. Die Verlierer trinken.' },
        { title: 'Kingscup', discription: 'Wird ein König gezogen, darf der Spieler ein Getränk seiner Wahl in den Kingscup gießen. Wird der vierte König gezogen, so muss der Spieler unverzüglich den Kingscup in der Mitte des Spiels leeren.' }
    ];

    constructor(private router: Router) {
        setInterval(() => this.checkTime(), 3000);
    }

    ngonDestroy() { }

    /**
     * this function returned a JSON for Firebase
     * @returns a JSON
     */
    public toJson() {
        return {
            players: this.players,
            playerGender: this.playerGender,
            stack: this.stack,
            playedCards: this.playedCards,
            currentPlayer: this.currentPlayer,
            gameIsRun: this.gameIsRun,
            Datenow: this.Datenow,
            currentCardDB: this.currentCardDB
        }
    }

    /** */
    checkTime() {
        this.timeJet = Date.now();
        this.addedAllGames();
        this.checkGames();
    }

    addedAllGames() {
        const q = query(this.getGamesRef(), limit(100));
        onSnapshot(q, (list) => {
            this.allGames = [];
            this.allGamesID = [];
            list.forEach(element => {
                this.allGamesID.push(element.id);
                this.allGames.push(element.data());
            })
        });
    }

    checkGames() {
        for (let i = 0; i < this.allGamesID.length; i++) {
            if (this.allGames[i].gameIsRun == true && this.timeJet > this.allGames[i].Datenow) {
                if (this.gameID == this.allGamesID[i]) this.router.navigateByUrl('');
                this.deleteDataBase(this.allGamesID[i]);
            }
        }
    }

    /** */
    /**
     * This function shuffled the Stack of Cards
     * @param array is the Stack of Cards
     */
    shuffle(array: any) {
        let currentIndex = array.length;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
    }

    /**
     * This function reset all Data of the Game with the ID
     */
    restoreData() {
        this.players = [];
        this.playerGender = [];
        this.stack = this.playedCards;
        this.playedCards = [];
        this.currentPlayer = 0;
        this.gameIsRun = false;
        this.dontShow = true;
        this.endOfGame = false;
        this.Datenow;
        this.shuffle(this.stack);
    }

    /**
     * this function Start Game with the ID
     * @param docId ID from Game
     * @returns return the game with ID
     */
    startExistGame(docId: any) {
        return onSnapshot(this.getOneGameDocRef(docId),
            (list) => {
                this.findGame = [];
                this.findGame.push(list.data());
                this.gameID = docId;
                if (this.findGame[0]) this.addedJson();
                if (this.playedCards.length == 0) this.shuffle(this.stack);
                setInterval(() => this.startCalcCards(), 200);
            });
    }

    /**
     * This Function added the JSON from Game
     */
    addedJson() {
        this.players = this.findGame[0].players;
        this.playerGender = this.findGame[0].playerGender;
        this.stack = this.findGame[0].stack;
        this.playedCards = this.findGame[0].playedCards;
        this.currentPlayer = this.findGame[0].currentPlayer;
        this.gameIsRun = this.findGame[0].gameIsRun;
        this.Datenow = this.findGame[0].Datenow;
        this.currentCardDB = this.findGame[0].currentCardDB;
    }

    /**
     * This function is calc all Cards in this Game
     */
    startCalcCards() {
        this.allCards = this.stack.length + this.playedCards.length;
    }

    /**
     * this function updated the game with the ID
     * @param docId ID from Game
     * @param data JSON (toJson Function)
     */
    async setGameData(docId: any, data: {}) {
        if (this.gameID) {
            await updateDoc(this.getOneGameDocRef(docId), data).catch(
                (err) => { console.error(err) }
            );
        }
    }

    /**
     * This function Search a Free Game
     * @returns return the Game of free ID
     */
    searchGames() {
        this.gameID = '';
        const q = query(this.getGamesRef(), where('gameIsRun', '==', false), limit(1));
        return onSnapshot(q, (list) => {
            list.forEach(element => {
                this.gameID = element.id;
            });
        });
    }

    /**
     * This function added a Game 
     */
    async addDataBase() {
        await this.addedStack();
        await addDoc(this.getGamesRef(), this.toJson()).catch(
            (err) => { console.error(err) }
        ).then(
            (docRef) => { console.log("Document written with ID:", docRef?.id) }
        )
    }

    /**
     * this function added the full Stack
     */
    async addedStack() {
        for (let i = 1; i < 14; i++) {
            this.stack.push('ace_' + i);
            this.stack.push('clubs_' + i);
            this.stack.push('diamonds_' + i);
            this.stack.push('hearts_' + i);
        }
        this.shuffle(this.stack);
    }

    /**
     * This Function delete A Game after 2h 
     * @param docId is the ID of Game
     */

    async deleteDataBase(docId: string) {
        await deleteDoc(this.getOneGameDocRef(docId)).catch(
            (err) => { console.log(err) }
        );
    }

    /**
     * This Function returned all Firebase collection
     * @returns the collection from firebase
     */
    getGamesRef() {
        return collection(this.firestore, "games");
    }

    /**
     * This Function returned one of Firebase collection width this ID
     * @param docId this is the ID 
     * @returns the collection from firebase
     */
    getOneGameDocRef(docId: string) {
        return doc(collection(this.firestore, "games"), docId);
    }
}