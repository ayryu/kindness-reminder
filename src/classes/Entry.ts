class Entry {
    id = (+new Date * Math.random()).toString(36).substring(0,6);
    userInput: string;
    checked = false;
    dateCreated = new Date();

    constructor(userInput: string) {
        this.userInput = userInput;
    }

    // public get userInput() {
    //     return this.userInput;
    // }
}

export { Entry };