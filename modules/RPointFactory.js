const RUtils = require('./RUtils');

class RPoint {
    constructor(x, y, tolerance = 4){
        this.x = x;
        this.y = y;
        this.tolerance = tolerance;
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
    scale(factor){
        this.x = this.x * factor;
        this.y = this.y * factor;
        return this;
    }
    transform(tfn){
        this.x = tfn(this.x);
        this.y = tfn(this.y);
        return this;
    }
    getDistance(rpoint){
        const dx = Math.abs(rpoint.x - this.x);
        const dy = Math.abs(rpoint.y - this.y);
        return Math.sqrt((dx * dx) + (dy * dy))
    }
    clone(){
        return new RPoint(this.x, this.y);
    }
    equals(rpoint){
        return this.constructor === rpoint.constructor
            && RUtils.round(this.x, this.tolerance) === RUtils.round(rpoint.x, this.tolerance)
            && RUtils.round(this.y, this.tolerance) === RUtils.round(rpoint.y, this.tolerance);
    }
    toString(){
        return this.x.toFixed() + 'x' + this.y.toFixed();
    }
}

class RPointFactory {
    static getPoint(x, y, t){
        return new RPoint(x, y, t);
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