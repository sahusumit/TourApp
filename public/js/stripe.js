import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe('pk_test_02IJlsY8AZAyZeDRFf60Ba4200QwsCtVIz');

export const bookTour = async tourId =>{
    try{
    //1) Get checkout session from API,
      const session = await axios(`http://localhost:4001/api/v1/bookings/checkout-session/${tourId}`);
      console.log(session);
    //2) Craete chekout from + charge credit card
     await stripe.redirectToCheckout({
         sessionId:session.data.session.id
     })
    } catch(error){
        console.log(error);
        showAlert('error', error)
    }

}