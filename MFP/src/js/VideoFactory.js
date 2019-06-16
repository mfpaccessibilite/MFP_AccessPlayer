import Html5Player from './VideoPlayers/Html5Player';

class VideoFactory{

    constructor(){}

    makeVideoInstance(ops){
        return new Html5Player(ops);
    }
}

export const videoFactory = new VideoFactory();
