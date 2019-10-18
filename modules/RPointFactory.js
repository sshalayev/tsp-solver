class RPoint {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    move(dx, dy){
        this.x += dx;
        this.y += dy;
        return this;
    }
    moveTo(x, y){
        this.x = x;
        this.y = y;
        return this;
    }
    getDistance(rpoint){
        const dx = Math.abs(rpoint.x - this.x);
        const dy = Math.abs(rpoint.y - this.y);
        return Math.round(Math.sqrt((dx * dx) + (dy * dy)))
    }
    clone(){
        return new RPoint(this.x, this.y);
    }
    equals(rpoint){
        return this.constructor === rpoint.constructor
            && this.x === rpoint.x
            && this.y === rpoint.y;
    }
    toString(){
        return this.x.toFixed(2) + 'x' + this.y.toFixed();
    }
}

class RPointFactory {
    static getPoint(x, y){
        return new RPoint(x, y);
    }
    static getRandomPoints (amount, maxX, maxY) {
        return new Array(amount).fill(0).map(() => new RPoint(RPointFactory.getRandomCoord(maxX), RPointFactory.getRandomCoord(maxY)));
    };
    static getRandomPoint (maxX, maxY) {
        return new RPoint(RPointFactory.getRandomCoord(maxX), RPointFactory.getRandomCoord(maxY))
    };
    static getRandomCoord (max) {
        return Math.floor(Math.random() * max);
    };
}

module.exports = {RPointFactory, RPoint};