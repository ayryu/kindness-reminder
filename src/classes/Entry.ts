class Entry {
    id = (+new Date * Math.random()).toString(36).substring(0,6);
    input: string;
    checked = false;
    date_created = new Date();

    constructor(input: string) {
        this.input = input;
    }

    // public get userInput() {
    //     return this.userInput;
    // }
}

export { Entry };