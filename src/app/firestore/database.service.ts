import { inject, Injectable } from '@angular/core';
import { collection, Firestore, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, where, limit, orderBy } from '@angular/fire/firestore';
import { Game } from '../../models/game';
import { ActivatedRoute } from '@angular/router';


@Injectable({
    providedIn: 'root'
})

export class DataBaseService {
    gameDB: any = inject(Game);
    gameID: string;
    ID:String;
    unsubGames;

    firestore: Firestore = inject(Firestore);

    constructor() {
        this.unsubGames = this.subGames();
    }

    ngonDestroy() {
        this.unsubGames();
    }

    subGames() {
        const q = query(this.getGamesRef(), limit(100));
        return onSnapshot(q, (list) => {
            this.gameDB.allGames = [];
            list.forEach(element => {
                this.gameDB.allGames.push(element.data());
            })
        });
    }

    startExistGame(docId: any) {
        return onSnapshot(this.getOneGameDocRef(docId),
            (list) => {
                this.gameDB.findGame = [];
                this.gameDB.findGame.push(list.data());
                this.gameID = docId;
                this.gameDB.players = this.gameDB.findGame[0].players;
                this.gameDB.playerGender = this.gameDB.findGame[0].playerGender;
                this.gameDB.stack = this.gameDB.findGame[0].stack;
                this.gameDB.playedCards = this.gameDB.findGame[0].playedCards;
                this.gameDB.currentPlayer = this.gameDB.findGame[0].currentPlayer;
                this.gameDB.gameIsRun = this.gameDB.findGame[0].gameIsRun;
                this.gameDB.shuffle(this.gameDB.stack);
            });
    }

    async setGameData(docId: any, data:{}) {
        if(this.gameID){
            await updateDoc(this.getOneGameDocRef(docId), data).catch(
                (err) => { console.error(err) }
            );
        }
    }

    searchGames() {
        const q = query(this.getGamesRef(), where('gameIsRun', '==', false), limit(1));
        return onSnapshot(q, (list) => {
            list.forEach(element => {
                this.gameID = element.id;
            })
        });
    }

    async addDataBase() {
        await this.addedStack();
        await addDoc(this.getGamesRef(), this.gameDB.toJson()).catch(
            (err) => { console.error(err) }
        ).then(
            (docRef) => { console.log("Document written with ID:", docRef?.id) }
        )
    }

    async addedStack(){
        for (let i = 1; i < 14; i++) {
            this.gameDB.stack.push('ace_' + i);
            this.gameDB.stack.push('clubs_' + i);
            this.gameDB.stack.push('diamonds_' + i);
            this.gameDB.stack.push('hearts_' + i);
        }
    }

    async deleteDataBase(docId: string) {
        await deleteDoc(this.getOneGameDocRef(docId)).catch(
            (err) => { console.log(err) }
        );
    }

    getGamesRef() {
        return collection(this.firestore, "games");
    }

    getOneGameDocRef(docId: string) {
        return doc(collection(this.firestore, "games"), docId);
    }
}