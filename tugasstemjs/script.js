const tombol = document.querySelector('#btnHitung');
const hasilElement = document.getElementById('boxHasil');

tombol.addEventListener('click' , () => {
    const beratbadan = parseFloat(document.getElementById('Weight').value);
    const tinggi_Cm =  parseFloat(document.getElementById('Height').value);

    if(!beratbadan || !tinggi_Cm) {
        hasilElement.textContent = 'Isi dulu dong!';
        hasilElement.style.color = 'red';
        return; 
    }

    let tinggi_M = tinggi_Cm / 100;
    let bmi = beratbadan / (tinggi_M * tinggi_M);
    let bmiRounded = Math.round(bmi * 10) / 10;

    let kategori = '';
    if (bmiRounded < 18.5) {
        kategori = 'Kurus';
    } else if (bmiRounded < 25) {
        kategori = 'Normal';
    } else if (bmiRounded < 30) {
        kategori = 'Gemuk';
    } else {
    kategori = 'Obesitas';
    }

    hasilElement.innerHTML = `BMI kamu: <b>${bmiRounded}</b> <br> Kategori:${kategori}`;
    hasilElement.style.color = 'black';
} ) 