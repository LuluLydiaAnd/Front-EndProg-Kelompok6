document.addEventListener('DOMContentLoaded', function() {
    
    // buka-tutup menu navigasi (ikon garis tiga) buat versi HP
    var menuIcon = document.getElementById('menu-icon');
    var navbar = document.querySelector('.navbar');

    if (menuIcon !== null && navbar !== null) {
        menuIcon.addEventListener('click', function() {
            var isHidden = navbar.style.display === 'none' || navbar.style.display === '';
            
            if (isHidden) {
                navbar.style.display = 'flex';
                menuIcon.className = 'bx bx-x'; // Ubah ikon ke bentuk silang (X)
            } else {
                navbar.style.display = 'none';
                menuIcon.className = 'bx bx-menu'; // Kembalikan ke bentuk strip 3
            }
        });
    }

    // Menyesuaikan tampilan navbar saat ukuran layar diubah (mencegah bug menu hilang di desktop)
    window.addEventListener('resize', function() {
        var screenWidth = window.innerWidth;
        
        if (screenWidth > 992) {
            if (navbar !== null) navbar.style.display = 'flex';
            if (menuIcon !== null) menuIcon.className = 'bx bx-menu';
        } else {
            if (navbar !== null && menuIcon !== null && menuIcon.className.indexOf('bx-x') === -1) {
                navbar.style.display = 'none';
            }
        }
    });

    // Fitur Like pada daftar menu
    var likeButtons = document.querySelectorAll('.btn-like');
    
    for (var i = 0; i < likeButtons.length; i++) {
        likeButtons[i].addEventListener('click', function(event) {
            event.preventDefault(); // Cegah halaman melompat ke atas
            
            var btn = this;
            var countSpan = btn.querySelector('.like-count');
            var icon = btn.querySelector('i');
            var count = parseInt(countSpan.textContent);

            if (btn.classList.contains('liked')) {
                // Batal like
                btn.classList.remove('liked');
                countSpan.textContent = count - 1;
                icon.className = 'bx bx-heart'; // Kembali ke ikon hati kosong
            } else {
                // Tambah like
                btn.classList.add('liked');
                countSpan.textContent = count + 1;
                icon.className = 'bx bxs-heart'; // Ubah ke ikon hati terisi

                // Animasi kedip manual
                icon.style.opacity = '0.3';
                setTimeout(function() {
                    icon.style.opacity = '1';
                }, 150);
            }
        });
    }

    // Accordion FAQ
    var faqQuestions = document.querySelectorAll('.faq-question');
    
    for (var j = 0; j < faqQuestions.length; j++) {
        faqQuestions[j].addEventListener('click', function() {
            var answer = this.nextElementSibling;
            var parent = this.parentElement;
            
            // Tutup semua FAQ lain yang terbuka
            var allAnswers = document.querySelectorAll('.faq-answer');
            var allItems = document.querySelectorAll('.faq-item');
            
            for (var k = 0; k < allAnswers.length; k++) {
                if (allAnswers[k] !== answer) {
                    allAnswers[k].style.display = 'none';
                }
            }
            for (var l = 0; l < allItems.length; l++) {
                if (allItems[l] !== parent) {
                    allItems[l].classList.remove('active');
                }
            }

            // Buka/tutup FAQ yang diklik
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
                parent.classList.remove('active');
            } else {
                answer.style.display = 'block';
                parent.classList.add('active');
            }
        });
    }

    // Form Kontak & Popup Pesan Sukses
    var contactForm = document.getElementById('contactForm');
    var successPopup = document.getElementById('successPopup');
    var closePopup = document.getElementById('closePopup');

    if (contactForm !== null) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Mencegah halaman reload atau melompat ke menu
            
            if (successPopup !== null) {
                successPopup.classList.add('show');
            }
            contactForm.reset(); // Mengosongkan isi input formulir
        });
    }

    if (closePopup !== null) {
        closePopup.addEventListener('click', function() {
            if (successPopup !== null) {
                successPopup.classList.remove('show');
            }
        });
    }

    if (successPopup !== null) {
        successPopup.addEventListener('click', function(event) {
            // Tutup popup jika area luar (backdrop) diklik
            if (event.target === this) {
                this.classList.remove('show');
            }
        });
    }

});