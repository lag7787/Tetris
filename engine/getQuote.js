export default async function getQuote() {

    let response;

    try {
        response = await axios({
            method: 'get',
            url: 'https://breaking-bad-quotes.herokuapp.com/v1/quotes',
          });

    } catch(error) {
        console.log(error);
    }

    return response;

}