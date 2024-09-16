import { inject, Injectable } from '@angular/core';
import { collection, Firestore, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, where, limit, orderBy } from '@angular/fire/firestore';
import { Game } from '../../models/game';

interface Games {
    game: string;
}

@Injectable({
    providedIn: 'root'
})

export class DataBaseService {
    gameDB: any = inject(Game);
    gameID: string[] = [];
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
            this.gameDB.testGame = [];
            list.forEach(element => {
                this.gameDB.testGame.push(element.data());
                //console.log(this.gameDB.testGame);
            })
        });
    }

    startExistGame(docId: any) {
        return onSnapshot(this.getOneGameDocRef(docId),
            (list) => {
                this.gameDB.testGame = [];
                this.gameDB.testGame.push(list.data());
                console.log(this.gameDB.testGame);
            });
    }

    searchGames() {
        const q = query(this.getGamesRef(), limit(1));
        return onSnapshot(q, (list) => {
            list.forEach(element => {
                this.gameID = [];
                this.gameID.push(element.id);
            })
        });
    }

    async addDataBase() {
        await addDoc(this.getGamesRef(), this.gameDB.toJson()).catch(
            (err) => { console.error(err) }
        ).then(
            (docRef) => { console.log("Document written with ID:", docRef?.id) }
        )
    }

    async deleteDataBase(docId: string) {
        await deleteDoc(this.getOneGameDocRef(docId)).catch(
            (err) => { console.log(err) }
        );
    }

    getGamesRef() {
        return collection(this.firestore, 'games');
    }

    getOneGameDocRef(docId: string) {
        return doc(collection(this.firestore, 'games'), docId);
    }
}