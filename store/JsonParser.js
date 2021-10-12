class JsonParser{
    constructor(url){
        this.url = url
        this.json = this.getJson()
    }
    async getJson() {
        try{
            const response = await fetch(this.url)
                .then(response => response.json())
            //console.log(response)
            return response
        }catch(err){
            console.log(err)
        }
    }
}