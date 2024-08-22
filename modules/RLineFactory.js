const {RPointFactory, RPoint} = require('./RpointFactory');
const RUtils = require('./RUtils');

class RRoute {
    constructor(points = [], strict = true) {
        this.strict = strict;
        this.points = [...points];
    }
    get start() {
        return this.points.length > 0 ? this.points[0] : null;
    }
    get end() {
        return this.points.length > 0 ? this.points[this.points.length - 1] : null;
    }
    get length(){
        return this.points.length
    }

    get isClosed(){
        return this.length > 0 && this.end.equals(this.start)
    }

    static create(points, strict = true) {
        return new RRoute(points, strict);
    }

    static fromArray(arr, strict = true){
        return new RRoute(arr.map(([x, y]) => RPointFactory.getPoint(x, y)), strict)
    }

    static normalize(points) {
        const result = [];
        for(let pt of points) {
            const index = result.findIndex(p => p.equals(pt))
            if (-1 === index)
                result.push(pt);
        }
        return result;
    }
    hasPoint(point) {
        return this.points.findIndex(pt => pt.equals(point)) > -1
    }

    getPointIndex(point) {
        for(let i = 1; i < this.points.length; i++){
            const pa = this.points[i - 1];
            const pb = this.points[i];
            if (point.equals(pa))
                return i - 1;
            else if (point.equals(pb))
                return i;
            else if (RUtils.round(pa.getDistance(pb), 4) === RUtils.round(pa.getDistance(point) + pb.getDistance(point), 4))
                return i - 1;
        }
        return -1;
    }

    pointRedundant(point){
        for(let i = 1; i < this.points.length; i++){
            const pa = this.points[i - 1];
            const pb = this.points[i];
            if (point.equals(pa) || point.equals(pb)
              || RUtils.round(pa.getDistance(pb), point.tolerance) === RUtils.round(pa.getDistance(point) + pb.getDistance(point), point.tolerance))
                return true;
        }
        return false
    }
    prepend(point) {
        if (!this.pointRedundant(point) || !this.strict)
            this.points.unshift(point);
        return this;
    }
    append(point) {
        if (!this.pointRedundant(point) || !this.strict)
            this.points.push(point);
        return this;
    }
    prependRoute(route) {
        this.points.unshift(
          ...route.points.slice(0, route.points.length - 1)
            .filter(point => (point instanceof RPoint) && (!this.pointRedundant(point) || !this.strict)));
        return this;
    }
    appendRoute(route) {
        for(let pt of route.points.slice(1)){

        }
        this.points.push(
          ...route.points.slice(1)
            .filter(point => (point instanceof RPoint) && (!this.pointRedundant(point) || !this.strict)));
        return this;
    }
    tryJoin(route){
        if (!(route instanceof RRoute) || this.isClosed || route.isClosed) return false;
        const originalLength = this.length;
        const startTouchIndex = route.getPointIndex(this.start);
        const endTouchIndex = route.getPointIndex(this.end);
        const routeStartTouchIndex = this.getPointIndex(route.start);
        const routeEndTouchIndex = this.getPointIndex(route.end);
        //console.log(`${this.length} + ${route.length}`)
        //console.log([startTouchIndex, endTouchIndex, routeStartTouchIndex, routeEndTouchIndex]);
        // both hands are on target route
        if (startTouchIndex > -1 && endTouchIndex > -1){
            if (-1 === routeStartTouchIndex || -1 === routeEndTouchIndex){
                this.points = [...route.points];
            }
            else if (this.end.equals(route.end)){
                const points = route.points.slice(0, endTouchIndex).reverse();
                this.points.push(...points);
                //console.log(`Pushed ${points.length} points and closed`);
            }
            else if (this.end.equals(route.start)){
                const points = route.points.slice(1);
                this.points.push(...points);
                //console.log(`Pushed ${points.length} points and closed`);
            }
        }
        else if (endTouchIndex > -1){
            if (routeStartTouchIndex > -1){
                const points = route.points.slice(endTouchIndex + 1);
                this.points.push(...points);
                //console.log(`Pushed ${points.length} points`);
            }
            else if (routeEndTouchIndex > -1){
                const points = route.points.slice(0, endTouchIndex).reverse();
                this.points.push(...points);
                //console.log(`Pushed ${points.length} points`);
            }
        }
        else if (startTouchIndex > -1){
            if (routeStartTouchIndex > -1){
                const points = route.points.slice(startTouchIndex + 1).reverse();
                this.points.unshift(...points);
                //console.log(`Prepended ${points.length} points`);
            }
            else if (routeEndTouchIndex > -1){
                const points = route.points.slice(0, startTouchIndex);
                this.points.unshift(...points);
                //console.log(`Prepended ${points.length} points`);
            }
        }
        //console.log(`${originalLength} => ${this.length}`);
        return this.length !== originalLength;
    }
    canBeJoined(route){
        if (!(route instanceof RRoute) || this.isClosed || route.isClosed) return false;

        return route.getPointIndex(this.start) > - 1 || route.getPointIndex(this.end) > -1
    }
    equals(other){
        if (this === other) return true;
        if (null == other || other.points.length !== this.points.length) return false;
        for(let i = 0; i < other.points.length; i++){
            if (!other.points[i].equals(this.points[i]))
                return false;
        }
        return true;
    }
    intersects(other){
        if (this === other) return true;
        if (null == other) return false;
        for(let point of this.points){
            const index = other.points.findIndex(op => op.equals(point))
            if (index > -1){
                return true;
            }
        }
        return false;
    }
    toString(){
        return this.points.map(point => `[${point.toString()}]`).join(' > ');
    }
    export(){
        return this.points.map(point => `${point.x},${point.y}`).join('\n');
    }
}
module.exports = {RRoute}