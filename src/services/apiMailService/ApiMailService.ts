import axios from 'axios'

const MailApi = axios.create({
    baseURL: 'http://192.168.18.24:3333/api/Email/SortAndSend'
})

export default {
    async sortAndSend(body: Array<{id: string, name: string, email: string}>){
        return new Promise((resolve, reject) => {
            MailApi.post<any>('', {
                data : {participants : body}
            }).then(
                res => resolve(res)
            ).catch(
                err => reject(err)
            )
        })
    }
}