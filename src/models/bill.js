class Bill {

    constructor(nameZb, fileNumber, identNr, workMin, fkCount, phoneCount, copyCount, porto) {

        this.nameZb = nameZb;
        this.fileNumber = fileNumber;
        this.billNr = new Date().getFullYear() + "/" + new Date().getMonth();
        this.identNr = identNr;
        this.workMin = workMin;
        this.salary = 33.50;
        this.workSum = round(workMin * (this.salary / 60));
        this.fkCount = fkCount;
        this.fkCost = 0.30;
        this.fkSum = round(fkCount * this.fkCost);
        this.phoneCount = phoneCount;
        this.phoneCost = 0.060;
        this.phoneSum = round(phoneCount * this.phoneCost);
        this.copyCount = copyCount;
        this.copyCost = 0.15;
        this.copySum = round(copyCount * this.copyCost);
        this.porto = porto;
        this.sum = round(this.workSum + this.fkSum + this.phoneSum + this.copySum + this.porto);
        this.sumTax = round(this.sum * 0.19);
        this.sumFinal = round(this.sum + this.sumTax);
    }

}

function round(num) {
    let result = Math.round(num * 100) / 100;
    return Number(result.toFixed(2));
}


module.exports = Bill;