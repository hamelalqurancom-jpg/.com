document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS (Animations)
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Navbar Scroll Effect
    // --- Countdown Timer Logic ---
    const countdownTarget = new Date("Feb 8, 2026 00:00:00").getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countdownTarget - now;

        if (distance < 0) {
            const countdownEl = document.getElementById("countdown");
            if (countdownEl) countdownEl.style.display = "none";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minsEl = document.getElementById("minutes");
        const secsEl = document.getElementById("seconds");

        if (daysEl) daysEl.innerText = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.innerText = hours.toString().padStart(2, '0');
        if (minsEl) minsEl.innerText = minutes.toString().padStart(2, '0');
        if (secsEl) secsEl.innerText = seconds.toString().padStart(2, '0');
    };

    if (document.getElementById("countdown")) {
        setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    // --- Navigation & Scroll logic cleaned up ---
    // Hero buttons scroll logic
    const heroApplyBtn = document.querySelector('.hero-btns .btn-primary');
    const heroDiscoverBtn = document.querySelector('.hero-btns .btn-secondary');

    if (heroApplyBtn) {
        heroApplyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const applySection = document.getElementById('apply');
            if (applySection) {
                applySection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (heroDiscoverBtn) {
        heroDiscoverBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Smooth Scrolling for all internal links

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Force AOS refresh after a short delay to account for smooth scroll
                setTimeout(() => {
                    AOS.refresh();
                }, 800);
            }
        });
    });

    // Contact Form (WhatsApp + Firebase)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('contactName').value.trim();
            const phone = document.getElementById('contactPhone').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            // Feedback: Change button text
            const submitBtn = contactForm.querySelector('button');
            const originalText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = 'جاري الإرسال...';

            try {
                // Save to Firebase if configured
                if (isFirebaseConfigured && db) {
                    await db.collection('messages').add({
                        name,
                        phone,
                        message,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        status: 'جديد'
                    });
                }

                const whatsappNumber = '201002200841';
                let messageText = `📬 *رسالة جديدة من الموقع* \n\n`;
                messageText += `👤 *الاسم:* ${name}\n`;
                messageText += `📱 *رقم الهاتف:* ${phone}\n`;
                messageText += `💬 *الرسالة:* ${message}`;

                const encodedText = encodeURIComponent(messageText);
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;

                window.open(whatsappUrl, '_blank');
                contactForm.reset();
                alert('تم إرسال رسالتك وحفظها بنجاح.');
            } catch (error) {
                console.error("Error saving message:", error);
                alert('حدث خطأ أثناء الإرسال، سيتم فتح الواتساب فقط.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
            }
        });
    }

    // Stats Counter Animation
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    const startCounters = () => {
        counters.forEach(counter => {
            const originalText = counter.innerText;
            const hasPlus = originalText.includes('+');
            const hasK = originalText.includes('K');
            const target = parseInt(originalText.replace('+', '').replace('K', '').replace(',', ''));
            if (isNaN(target)) return;

            let current = 0;
            const increment = target / speed;

            const updateCount = () => {
                current += increment;

                if (current < target) {
                    let displayValue = Math.ceil(current);
                    if (hasK) displayValue = displayValue + 'K';
                    if (hasPlus) displayValue = displayValue + '+';

                    counter.innerText = displayValue;
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = originalText;
                }
            };
            updateCount();
        });
    };

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCounters();
                observer.unobserve(statsSection);
            }
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    // --- Past Winners History & Restriction Logic ---
    const PAST_YEAR_WINNERS = {
        1: ["أحمد السيد مصطفى قنديل", "السيد سعد مصطفى كلبوش", "أبرار يحيى فتحي عطية", "أحمد عبدالله إسماعيل النجار", "ملك محمد أحمد العدوي", "رمضان أشرف محمد الطريني", "بسملة خالد كشكة", "محمد علي أحمد السيد علي", "منة إبراهيم محمد مخيمر", "فاطمة محمد أحمد غبيش"],
        2: ["آلاء محمد عبدالنبي دويدار", "فاطمة محمد محمد البرهامي", "مالك مصطفى السيد فوز الله", "بسملة طه عبدالعزيز علي", "منار عبدالحميد رمضان البرهامي", "ياسمين حسين مصطفى صحصاح", "زياد محمد عادل ابراهيم", "هاجر عبدالرازق الغفلول", "محمد السيد محمد خفاجي", "جنى السيد علي الطريني"],
        3: ["مازن مصطفى السيد فوز الله", "سلمى إبراهيم بسيوني خلف", "يوسف طه يوسف ياسين", "أنس عيسى محمد دويدار", "تقى عبدالرازق بسيوني خلف", "عمر إكرامي السيد عفيفي", "محمد حلمي جمال سالم", "أحمد عبدالرازق الطريني", "زياد يوسف عبداللطيف", "يوسف هيثم السيد العفيفي", "رنا صابر عبدالمحسن زليطة", "محمد محمود سليمان", "صلاح حمادة صلاح أبو الخير", "عدي أشرف نجيب الغفلول", "أحمد مصطفى حسن الفضالي", "ياسمين عبدالرازق بسيوني خلف", "محمد أحمد محمد الدميري", "ريم مخيمر السعودي", "محمد يحيى عطية", "عبدالحليم صابر ابوشعيشع النجار"],
        4: ["مالك فتحي حسن النجار", "ماريا إكرامي السيد العفيفي", "كريم هيثم عبدالعزيز خلفة", "جنى حسني يوسف ليلة", "جنى محمود إبراهيم شلبي", "محمد عبدالحميد العدوي", "رنا درغام محمد زليطة", "عبدالمنعم وائل الجوهري", "أنس فتحي طه الحشاش", "أسيل فتحي فؤاد البهبيتي", "زياد غازي أحمد الطريني", "كريم أحمد فؤاد البهبيتي", "جنى صابر محمد عبدالحليم", "عائشة طاهر اسماعيل الشيخ", "عمر أحمد مصطفى زردق", "رمضان إبراهيم رمضان زليطة", "أيسل فتحي سيدأحمد خفاجي", "معاذ عماد حمدي عبدالله", "مصطفى بسيوني الزرزور", "بسملة محمد علي عابدين", "روفان بلال الفخراني", "آدم عيسى عبدالرازق العدوي", "عبدالرحمن سامح الحسني", "حنان فرج عبدالخالق الغفلول", "رهف حمادة طه سليم", "منى رجب عبدالستار علي", "محمد سيدأحمد عبدالفتاح زايد", "روقية رمزي عطية الفيشاوي", "أنس محمد فتوح زليطة", "عبدالعزيز عبدالله خلفة", "رودينا محمد سيدأحمد أبوالسعود", "حسن سامح حسن الغفلول"]
    };

    const LEVEL_HIERARCHY = {
        'المستوى الأول (القرآن كاملاً)': 1,
        'المستوى الثاني (ثلاثة أرباع القرآن)': 2,
        'المستوى الثالث (نصف القرآن)': 3,
        'المستوى الرابع (ربع القرآن)': 4,
        'المستوى الخامس (البراعم - 5 أجزاء)': 5
    };

    function normalizeArabicName(name) {
        if (!name) return "";
        return name.trim()
            .replace(/\s+/g, ' ')
            .replace(/[أإآ]/g, 'ا')
            .replace(/ة/g, 'ه')
            .replace(/[ى]/g, 'ي')
            .replace(/[ـ]/g, ''); // إزالة التطويل
    }

    // --- Firebase Configuration ---
    const firebaseConfig = {
        apiKey: "AIzaSyCsVH5BVV9abx66UicOa51T1qADmUVrd7U",
        authDomain: "hamel-b7a68.firebaseapp.com",
        projectId: "hamel-b7a68",
        storageBucket: "hamel-b7a68.firebasestorage.app",
        messagingSenderId: "818022836347",
        appId: "1:818022836347:web:ebcdef3f19c53cd1ef1ade",
        measurementId: "G-HEMLZDRBS3"
    };

    // Initialize Firebase
    let db = null;
    let storage = null;
    let auth = null;
    const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

    if (typeof firebase !== 'undefined' && isFirebaseConfigured) {
        try {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            storage = firebase.storage();
            auth = firebase.auth();
        } catch (err) {
            console.error("Firebase Init Error:", err);
        }
    }



    let appSettings = {
        registrationStatus: 'open',
        nominationStatus: 'open'
    };

    async function fetchSettings() {
        if (!isFirebaseConfigured || !db) return;
        try {
            const doc = await db.collection('settings').doc('appConfig').get();
            if (doc.exists) {
                appSettings = doc.data();
                applySettings();
            }
        } catch (err) {
            console.error("Error fetching settings:", err);
        }
    }

    function applySettings() {
        // Main Registration Section enforcement
        const regForm = document.getElementById('registrationForm');
        const countdownEl = document.getElementById('countdown');

        if (appSettings.registrationStatus === 'closed') {
            if (regForm) {
                const formHeader = regForm.closest('.apply-card')?.querySelector('.form-header p');
                if (formHeader) {
                    formHeader.innerHTML = '<span style="color: #ff4d4d; font-weight: bold; font-size: 1.2rem;">⚠️ عذراً، باب التقديم الإلكتروني مغلق حالياً.</span>';
                }
                regForm.style.opacity = '0.6';
                regForm.style.pointerEvents = 'none';
                const submitBtn = document.getElementById('submitBtn');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    const btxt = submitBtn.querySelector('.btn-text');
                    if (btxt) btxt.textContent = 'باب التقديم مغلق';
                    submitBtn.style.background = '#666';
                }
            }
            // Update Hero Badge if it exists
            const heroBadge = document.querySelector('.hero-badge');
            if (heroBadge) {
                heroBadge.textContent = 'باب التقديم مغلق حالياً';
                heroBadge.style.background = 'rgba(255, 77, 77, 0.2)';
                heroBadge.style.color = '#ff4d4d';
                heroBadge.style.borderColor = '#ff4d4d';
            }
        } else {
            // Normal state
        }

        // Nomination Section enforcement
        const nominationForm = document.getElementById('nominationForm');
        if (appSettings.nominationStatus === 'closed') {
            if (nominationForm) {
                nominationForm.style.opacity = '0.6';
                nominationForm.style.pointerEvents = 'none';
                const nomBtn = nominationForm.querySelector('button');
                if (nomBtn) {
                    nomBtn.disabled = true;
                    nomBtn.textContent = 'باب الترشيح مغلق';
                    nomBtn.style.background = '#666';
                }
            }
        }
    }
    fetchSettings();

    // --- National ID Age Calculation ---
    function calculateAgeFromID(nationalID) {
        if (!nationalID || nationalID.length < 7) return null;
        const centuryDigit = nationalID[0];
        const yearPart = nationalID.substring(1, 3);
        const monthPart = nationalID.substring(3, 5);
        const dayPart = nationalID.substring(5, 7);

        let fullYear;
        if (centuryDigit === '2') {
            fullYear = 1900 + parseInt(yearPart);
        } else if (centuryDigit === '3') {
            fullYear = 2000 + parseInt(yearPart);
        } else {
            return null; // Invalid century digit
        }

        const birthDate = new Date(fullYear, parseInt(monthPart) - 1, parseInt(dayPart));
        if (isNaN(birthDate.getTime())) return null;

        const today = new Date();
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += lastMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        return {
            years,
            months,
            days,
            birthDate: `${fullYear}-${monthPart}-${dayPart}`,
            formattedAge: `${years} سنة و ${months} شهر و ${days} يوم`
        };
    }

    // Modal Control Functions
    window.proceedToFinalStep = () => {
        document.getElementById('confirmationModal').style.display = 'none';
        document.getElementById('seatNumberModal').style.display = 'flex';
    };

    window.showBlockedModal = (message) => {
        const modal = document.getElementById('blockedModal');
        const msgEl = document.getElementById('blockedModalMessage');
        if (modal && msgEl) {
            msgEl.textContent = message;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeBlockedModal = () => {
        document.getElementById('blockedModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    // Registration Form logic
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        const submitBtn = document.getElementById('submitBtn');
        const loader = document.getElementById('loader');
        const btnText = submitBtn?.querySelector('.btn-text');
        const agreeTerms = document.getElementById('agreeTerms');

        if (agreeTerms && submitBtn) {
            agreeTerms.addEventListener('change', () => {
                if (agreeTerms.checked && appSettings.registrationStatus === 'open') {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.cursor = 'pointer';
                } else {
                    submitBtn.disabled = true;
                    submitBtn.style.opacity = '0.5';
                    submitBtn.style.cursor = 'not-allowed';
                }
            });
        }


        // File selection UI feedback
        const fileInputs = registrationForm.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const container = input.closest('.custom-file-upload');
                const textSpan = container ? container.querySelector('.file-text') : null;
                if (e.target.files.length > 0) {
                    if (container) container.classList.add('has-file');
                    if (textSpan) {
                        textSpan.innerHTML = `<i class="fas fa-check-circle" style="color: #28a745;"></i> تم اختيار: ${e.target.files[0].name}`;
                    }
                } else {
                    if (container) container.classList.remove('has-file');
                    if (textSpan) {
                        textSpan.innerHTML = input.id === 'birthCertFile' ?
                            '<i class="fas fa-cloud-upload-alt"></i> اختر صورة شهادة الميلاد' :
                            '<i class="fas fa-image"></i> اختر الصورة الشخصية';
                    }
                }
            });
        });

        // --- Cloudinary Upload Function ---
        async function uploadToCloudinary(file, type, folderName, cloudName, uploadPreset, studentName) {
            if (!file) return null;
            if (btnText) btnText.innerHTML = `<i class="fas fa-spinner fa-spin"></i> جاري رفع ${type}...`;

            // Create a unique public_id based on student name and current time
            const uniquePublicId = `${studentName.replace(/\s+/g, '_')}_${Date.now()}`;
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);
            formData.append('folder', folderName);
            formData.append('public_id', uniquePublicId); // Add public_id
            formData.append('context', `type=${type}|uploaded_at=${new Date().toISOString()}`);

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                if (data.secure_url) {
                    return data.secure_url;
                } else {
                    console.error('Cloudinary Error Data:', data);
                    throw new Error(data.error?.message || 'Upload failed');
                }
            } catch (error) {
                console.error('Cloudinary Error:', error);
                throw new Error(`تعذر رفع ${type}. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.`);
            }
        }

        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (appSettings.registrationStatus === 'closed') {
                alert('عذراً، باب التقديم الإلكتروني مغلق حالياً.');
                return;
            }

            const studentNameInput = registrationForm.querySelector('input[name="studentName"]');
            const nationalIDInput = registrationForm.querySelector('input[name="nationalID"]');
            if (!studentNameInput || !nationalIDInput) return;

            const studentName = studentNameInput.value.trim();
            const nationalID = nationalIDInput.value.trim();

            if (localStorage.getItem(`registered_id_${nationalID}`)) {
                alert('عذراً، لقد قمت بالتقديم مسبقاً بهذا الرقم القومي.');
                return;
            }

            const ageInfo = calculateAgeFromID(nationalID);
            if (!ageInfo) {
                alert('يرجى التأكد من صحة الرقم القومي (14 رقم تبدأ بـ 2 أو 3).');
                return;
            }

            if (ageInfo.years > 16 || (ageInfo.years === 16 && (ageInfo.months > 0 || ageInfo.days > 0))) {
                alert('عذراً، يجب ألا يزيد عمر المتسابق عن 16 عاماً بالضبط.');
                return;
            }



            // --- 1. Unique Phone Numbers Validation ---
            const formData = new FormData(registrationForm);
            const p1 = formData.get('phone1')?.trim();
            const p2 = formData.get('phone2')?.trim();
            const p3 = formData.get('phone3')?.trim();
            const sp = formData.get('sheikhPhone')?.trim();

            const phoneList = [p1, p2, p3, sp].filter(p => p && p !== "");
            const uniquePhones = new Set(phoneList);
            if (uniquePhones.size !== phoneList.length) {
                alert("⚠️ يرجى إدخال أرقام هواتف مختلفة. لا يسمح بتكرار نفس الرقم في أكثر من خانة.");
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                if (loader) loader.style.display = 'inline-block';
                if (btnText) btnText.innerHTML = '<span style="font-size: 0.8rem;">يرجى الانتظار ولاتغلق الصفحة حتى يتم رفع الصور واستلام رقم الجلوس...</span>';
            }

            try {
                // --- 2. Image Uploads to Cloudinary (Mandatory Check) ---
                const birthCertFile = document.getElementById('birthCertFile').files[0];
                const personalPhotoFile = document.getElementById('personalPhotoFile').files[0];

                if (!birthCertFile || !personalPhotoFile) {
                    alert("⚠️ يرجى رفع صورة شهادة الميلاد والصورة الشخصية أولاً لإتمام التسجيل.");
                    resetSubmitBtn();
                    return;
                }

                let birthCertUrl = '';
                let personalPhotoUrl = '';

                // Account 1 (duvunzwm2) for Birth Certificates
                birthCertUrl = await uploadToCloudinary(birthCertFile, 'شهادة الميلاد', 'birth_certs', 'duvunzwm2', 'hamel_preset', studentName);

                // Account 2 (dvzqe1zr7) for Personal Photos
                personalPhotoUrl = await uploadToCloudinary(personalPhotoFile, 'الصورة الشخصية', 'student_photos', 'dvzqe1zr7', 'hamel_preset_2', studentName);

                if (isFirebaseConfigured && db) {
                    if (btnText) btnText.innerHTML = '<i class="fas fa-shield-alt"></i> جاري فحص سجل السوابق...';

                    // --- 3. Check Block List ---
                    const blockCheckID = await db.collection('blockedStudents').where('nationalID', '==', nationalID).limit(1).get();
                    if (!blockCheckID.empty) {
                        showBlockedModal('⚠️ عذراً، لا يمكن قبول هذا الطلب. يرجى مراجعة الإدارة.');
                        resetSubmitBtn();
                        return;
                    }

                    // --- 4. Past Winners Check ---
                    const normalizedInputName = normalizeArabicName(studentName);
                    const selectedLevel = formData.get('level');
                    const currentLevelRank = LEVEL_HIERARCHY[selectedLevel];

                    let pastLevelRank = null;
                    for (let rank in PAST_YEAR_WINNERS) {
                        const winnerFound = PAST_YEAR_WINNERS[rank].some(w => normalizeArabicName(w) === normalizedInputName);
                        if (winnerFound) {
                            pastLevelRank = parseInt(rank);
                            break;
                        }
                    }

                    if (pastLevelRank !== null) {
                        if (pastLevelRank === 1 || currentLevelRank >= pastLevelRank) {
                            showBlockedModal("عذراً، لا يسمح بالمشاركة في نفس المستوى أو مستوى أقل من مستوى فوزك السابق.");
                            resetSubmitBtn();
                            return;
                        }
                    }

                    // --- 5. Duplicate Check ---
                    const idCheck = await db.collection('registrations').where('nationalID', '==', nationalID).limit(1).get();
                    if (!idCheck.empty) {
                        showBlockedModal('⚠️ عذراً، هذا الرقم القومي مسجل مسبقاً.');
                        resetSubmitBtn();
                        return;
                    }

                    if (btnText) btnText.textContent = 'جاري حجز رقم الجلوس...';

                    const registrationData = {
                        studentName, nationalID,
                        ageYears: ageInfo.years, ageMonths: ageInfo.months, ageDays: ageInfo.days,
                        birthDate: ageInfo.birthDate, formattedAge: ageInfo.formattedAge,
                        gender: formData.get('gender'),
                        phone1: formData.get('phone1'), phone2: formData.get('phone2'), phone3: formData.get('phone3'),
                        address: formData.get('address'),
                        sheikhName: formData.get('sheikhName'), sheikhPhone: formData.get('sheikhPhone'),
                        level: formData.get('level'),
                        birthCertPath: birthCertUrl,
                        personalPhotoPath: personalPhotoUrl,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    };

                    const counterRef = db.collection('counters').doc(`${registrationData.gender}_${registrationData.level}`);
                    const seatNumber = await db.runTransaction(async (transaction) => {
                        const counterDoc = await transaction.get(counterRef);
                        let count = 0; if (counterDoc.exists) count = counterDoc.data().count;

                        const ranges = {
                            'بنين': { 'المستوى الأول (القرآن كاملاً)': 4000, 'المستوى الثاني (ثلاثة أرباع القرآن)': 4301, 'المستوى الثالث (نصف القرآن)': 4801, 'المستوى الرابع (ربع القرآن)': 5501, 'المستوى الخامس (البراعم - 5 أجزاء)': 1 },
                            'بنات': { 'المستوى الأول (القرآن كاملاً)': 2000, 'المستوى الثاني (ثلاثة أرباع القرآن)': 2301, 'المستوى الثالث (نصف القرآن)': 2801, 'المستوى الرابع (ربع القرآن)': 3501, 'المستوى الخامس (البراعم - 5 أجزاء)': 1001 }
                        };

                        const start = ranges[registrationData.gender][registrationData.level];
                        const assignedSeat = start + count;
                        const committeeNumber = Math.ceil((count + 1) / 20);

                        transaction.set(counterRef, { count: count + 1 });
                        const newRegRef = db.collection('registrations').doc();
                        registrationData.seatNumber = assignedSeat;
                        registrationData.committee = committeeNumber;
                        transaction.set(newRegRef, registrationData);

                        return { assignedSeat, committeeNumber };
                    });

                    // Success UI
                    document.getElementById('displayStudentName').textContent = studentName;
                    document.getElementById('displaySeatNumber').textContent = seatNumber.assignedSeat;
                    const committeeDisplay = document.getElementById('displayCommittee');
                    if (committeeDisplay) committeeDisplay.textContent = seatNumber.committeeNumber;

                    document.getElementById('confirmationModal').style.display = 'flex';
                }

                localStorage.setItem(`registered_id_${nationalID}`, 'true');
                registrationForm.reset();
                if (agreeTerms) agreeTerms.checked = false;

            } catch (error) {
                console.error("Submission Error:", error);
                alert('حدث خطأ: ' + error.message);
            } finally {
                resetSubmitBtn();
            }
        });

        function resetSubmitBtn() {
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.5';
                submitBtn.style.cursor = 'not-allowed';
                if (loader) loader.style.display = 'none';
                if (btnText) btnText.textContent = 'إرسال طلب التقديم';
                if (agreeTerms) agreeTerms.checked = false;
            }
        }
    }

    // Modal close function
    window.closeSeatModal = () => {
        document.getElementById('seatNumberModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    // --- Gallery & Lightbox Logic ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    // Initially, only the first 4 items are visible (handled by CSS/HTML .hidden-gallery-item)
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            const hiddenItems = document.querySelectorAll('.hidden-gallery-item');
            hiddenItems.forEach(item => {
                item.style.display = 'block';
                // Remove the class to ensure they stay visible
                item.classList.remove('hidden-gallery-item');
            });
            loadMoreBtn.style.display = 'none';
            if (typeof AOS !== 'undefined') AOS.refresh();
        });
    }

    // Lightbox Modal Functionality
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img && lightbox && lightboxImg) {
                lightboxImg.src = img.src;
                lightbox.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            if (lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    // Nomination Form Logic
    const nominationForm = document.getElementById('nominationForm');
    if (nominationForm) {
        nominationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (appSettings.nominationStatus === 'closed') {
                alert('عذراً، باب الترشيح مغلق حالياً.');
                return;
            }

            const submitNomBtn = nominationForm.querySelector('button[type="submit"]');
            const originalText = submitNomBtn.innerHTML;

            try {
                submitNomBtn.disabled = true;
                submitNomBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';

                const formData = new FormData(nominationForm);
                const data = {
                    nominatorName: formData.get('nominatorName') || 'فاعل خير',
                    nominatorPhone: formData.get('nominatorPhone'),
                    awardType: formData.get('awardType'),
                    nomineeName: formData.get('nomineeName'),
                    reason: formData.get('reason'),
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                };

                if (isFirebaseConfigured && db) {
                    await db.collection('nominations').add(data);
                    alert('تم إرسال ترشيحك بنجاح! شكراً لمشاركتك.');
                    nominationForm.reset();
                } else {
                    alert('عذراً، نظام الترشيحات غير متاح حالياً.');
                }
            } catch (err) {
                console.error("Nomination Error:", err);
                alert('حدث خطأ أثناء إرسال الترشيح. يرجى المحاولة لاحقاً.');
            } finally {
                submitNomBtn.disabled = false;
                submitNomBtn.innerHTML = originalText;
            }
        });
    }

    // --- Last Year Winners Board Generation & Toggle ---
    const toggleWinnersBtn = document.getElementById('toggleWinnersBtn');
    const winnersBoard = document.getElementById('winnersBoard');
    const winnersGrid = document.getElementById('winnersGrid');

    const LEVEL_TITLES = {
        1: "المستوى الأول (القرآن كاملاً)",
        2: "المستوى الثاني (ثلاثة أرباع القرآن)",
        3: "المستوى الثالث (نصف القرآن)",
        4: "المستوى الرابع (ربع القرآن)"
    };

    function generateWinnersBoard() {
        if (!winnersGrid) return;
        winnersGrid.innerHTML = '';

        for (let level in PAST_YEAR_WINNERS) {
            const winners = PAST_YEAR_WINNERS[level];
            const card = document.createElement('div');
            card.className = 'level-winner-card';
            card.setAttribute('data-aos', 'fade-up');

            let winnersHtml = `
                <div class="level-card-header">
                    <h3>${LEVEL_TITLES[level] || 'مستوى تعليمي'}</h3>
                    <div class="decorative-line" style="width: 50px; margin: 5px auto;"></div>
                </div>
                <ul class="winners-list">
            `;

            winners.forEach((name, index) => {
                const rank = index + 1;
                let rankClass = 'rank-other';
                let rankLabel = rank;

                if (rank === 1) rankClass = 'rank-1';
                else if (rank === 2) rankClass = 'rank-2';
                else if (rank === 3) rankClass = 'rank-3';

                winnersHtml += `
                    <li class="winner-li">
                        <div class="rank-badge ${rankClass}">${rankLabel}</div>
                        <span class="winner-name">${name}</span>
                    </li>
                `;
            });

            winnersHtml += `</ul>`;
            card.innerHTML = winnersHtml;
            winnersGrid.appendChild(card);
        }
    }

    if (toggleWinnersBtn && winnersBoard) {
        let isGenerated = false;
        toggleWinnersBtn.addEventListener('click', () => {
            if (winnersBoard.style.display === 'none') {
                if (!isGenerated) {
                    generateWinnersBoard();
                    isGenerated = true;
                }
                winnersBoard.style.display = 'block';
                toggleWinnersBtn.innerHTML = '<i class="fas fa-times"></i> إغلاق لوحة الشرف';
                toggleWinnersBtn.classList.remove('btn-secondary');
                toggleWinnersBtn.classList.add('btn-primary');

                // Refresh AOS to animate the new elements
                setTimeout(() => {
                    AOS.refresh();
                    winnersBoard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } else {
                winnersBoard.style.display = 'none';
                toggleWinnersBtn.innerHTML = '<i class="fas fa-trophy"></i> أوائل العام الماضي (2025)';
                toggleWinnersBtn.classList.remove('btn-primary');
                toggleWinnersBtn.classList.add('btn-secondary');
            }
        });
    }
});
