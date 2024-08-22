class RUtils {
  static round(n, frac){
    return Math.round(n * Math.pow(10, frac)) / Math.pow(10, frac);
  }
}
module.exports = RUtils;