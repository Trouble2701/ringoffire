import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class Game {
    players:string[] = [];
    playerGender:string[] = [];
    stack:string[] = [];
    playedCards:string[] = [];
    currentPlayer:number = 0;
    testGame:string[] = [];

    alertNumber:number=1;
    newTitleDB?:string;
    newDisDB?:string;

    allCards?:any;
    dontShow = true;
    endOfGame = false;

    cardAction = [
        {title:'Wasserfall', discription:'Das Ass steht für den Wasserfall. Alle Spieler setzen zum trinken an. Im Uhrzeigersinn darf erst dann mit dem Trinken aufgehört werden, wenn der rechte Sitznachbar davor seinen Wasserfall beendet hat. Der Spieler, der das Ass zieht darf zu erst aufhören zu trinken (wann er will).'},
        {title:'Du', discription:'Du darfst eine Person bestimmen, die einen Schluck aus ihrem Getränk nimmt..'},
        {title:'Ich', discription:'Du musst einen Schluck trinken.'},
        {title:'Boden', discription:'Berühre mit deiner Hand den Boden. Der Mitspieler, der zuletzt den Boden berührt, muss einen Schluck trinken.'},
        {title:'Daumen', discription:'Berühre mit deinem Daumen die Tischplatte. Der Mitspieler der zuletzt den Tisch berührt, muss einen Schluck trinken.'},
        {title:'Frauenrunde', discription:'Die Damen der Schöpfung müssen einen Schluck trinken.'},
        {title:'Himmel', discription:'Zeige mit deinem Zeigefinger gen Himmel. Wer zuletzt zum Himmel zeigt, muss einen Schluck trinken.'},
        {title:'Mit Trinken', discription:'Bestimme einen Mitspieler, der von nun an jedes Mal mit dir einen Schluck trinken muss, wenn du dazu aufgefordert wirst.'},
        {title:'Reim', discription:'Such dir ein Wort aus. Im Uhrzeigersinn müssen die Mitspieler einen Reim darauf finden. Wer ein Wort wiederholt oder keinen neuen Reim mehr nennen kann, muss einen Schluck trinken.'},
        {title:'Männerrunde', discription:'Die Männer dürfen anstoßen und einen Schluck trinken.'},
        {title:'Neue Regel', discription:'Die Person, die einen Buben zieht, darf sich eine neue Spielregel ausdenken, die bis zum Ende des Spiels gilt. Die Regel darf keine anderen außer Kraft setzen.'},
        {title:'Ausruf', discription:'Der Spieler darf eine Runde "Never have I ever..." ausrufen. Die Verlierer trinken.'},
        {title:'Kingscup', discription:'Wird ein König gezogen, darf der Spieler ein Getränk seiner Wahl in den Kingscup gießen. Wird der vierte König gezogen, so muss der Spieler unverzüglich den Kingscup in der Mitte des Spiels leeren.'}
      ];

    constructor(){
        for(let i = 1; i < 14; i++){
            this.stack.push('ace_'+i);
            this.stack.push('clubs_'+i);
            this.stack.push('diamonds_'+i);
            this.stack.push('hearts_'+i);
        }

        shuffle(this.stack);
        setInterval(() => this.startCalcCards(), 100);
    }

    startCalcCards(){
        this.allCards = this.stack.length + this.playedCards.length;
    }

    public toJson(){
        return {
            players: this.players,
            playerGender: this.playerGender,
            stack: this.stack,
            playedCards: this.playedCards,
            currentPlayer: this.currentPlayer,
        }
    }
}

function shuffle(array:any) {
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