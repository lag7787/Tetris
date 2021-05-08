export default async function getJoke() {

    let response;

    try {
        response = await axios({
            method: 'get',
            url: 'https://api.thecatapi.com/v1/images/search',
          });

    } catch(error) {
        console.log(error);
    }

    return response;

}