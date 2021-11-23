class Message {
    user=""
    content=""
    meetingID=""
    constructor(user, content, meetingID){
        this.user = user
        this.content = content
        this.meetingID = meetingID
    }
    toHTML(){
        return `
        <b>From ${this.user} to Everyone</b>
        <div class="chat-message">
            ${this.content}
        </div>
        `
    }
}
export default Message