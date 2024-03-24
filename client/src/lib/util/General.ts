export const mapValue = (value:number, fromMin:number, fromMax:number, toMin:number, toMax:number): number => {
    return (value - fromMin) * (toMax - toMin) / (fromMax - fromMin) + toMin;
}