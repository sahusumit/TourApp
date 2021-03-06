export const hiddAlert = () =>{
    const el = document.querySelector('.alert');
    if(el)  el.parentElement.removeChild(el);
}

export const showAlert = (type, msg, time=5) =>{
   const markup = `<div class ="alert alert--${type}">${msg}</div>`
   document.querySelector('body').insertAdjacentHTML('afterbegin', markup)
   window.setTimeout(hiddAlert, time*1000);
};