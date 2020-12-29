import axios from 'axios'
import env from '../../../env'

const MailApi = axios.create({
    baseURL: `${env.API_MAIL_URL}api/Email/SortAndSend`
})

export default {
    async sortAndSend(body: Array<{id: string, name: string, email: string}>){
        return new Promise((resolve, reject) => {
            MailApi.post<any>('', 
                {participants : body}
            ).then(
                res => resolve(res)
            ).catch(
                err => reject(err)
            )
        })
    }
}