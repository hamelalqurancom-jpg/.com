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
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset; // Removed -80 offset
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
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

    // --- Firebase Configuration ---
    const firebaseConfig = {
        apiKey: "AIzaSyA6fnq6E4P4aLvtOLRfUogPNLV__MIlcD8",
        authDomain: "dddd-3161a.firebaseapp.com",
        projectId: "dddd-3161a",
        storageBucket: "dddd-3161a.firebasestorage.app",
        messagingSenderId: "295943367803",
        appId: "1:295943367803:web:5c859045aad563af4a06de",
        measurementId: "G-M3FJ7TGZYJ"
    };

    // Initialize Firebase
    let db = null;
    let storage = null;
    const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

    if (typeof firebase !== 'undefined' && isFirebaseConfigured) {
        try {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            storage = firebase.storage();
        } catch (err) {
            console.error("Firebase Init Error:", err);
        }
    }

    // --- Global Settings enforcement ---
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
                    if (textSpan) textSpan.textContent = 'تم اختيار: ' + e.target.files[0].name;
                } else {
                    if (container) container.classList.remove('has-file');
                    if (textSpan) textSpan.textContent = input.id === 'idFile' ? 'اختر صورة شهادة الميلاد' : 'اختر الصورة الشخصية';
                }
            });
        });

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

            // --- 1. Unique Phone Numbers Validation ---
            const formData = new FormData(registrationForm);
            const p1 = formData.get('phone1')?.trim();
            const p2 = formData.get('phone2')?.trim();
            const p3 = formData.get('phone3')?.trim();
            const sp = formData.get('sheikhPhone')?.trim();

            const phoneList = [p1, p2, p3, sp].filter(p => p && p !== "");
            const uniquePhones = new Set(phoneList);
            if (uniquePhones.size !== phoneList.length) {
                alert("⚠️ يرجى إدخال أرقام هواتف مختلفة. لا يسمح بتكرار نفس الرقم في أكثر من خانة لضمان القدرة على التواصل معك.");
                return;
            }

            const ageInfo = calculateAgeFromID(nationalID);
            if (!ageInfo) {
                alert('يرجى التأكد من صحة الرقم القومي (14 رقم تبدأ بـ 2 أو 3).');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                if (loader) loader.style.display = 'inline-block';
                if (btnText) btnText.textContent = 'جاري التحقق من البيانات...';
            }

            try {
                // --- 2. Duplicate Check (Name and National ID) ---
                if (isFirebaseConfigured && db) {
                    const idCheck = await db.collection('registrations')
                        .where('nationalID', '==', nationalID)
                        .limit(1)
                        .get();

                    if (!idCheck.empty) {
                        alert('⚠️ عذراً، هذا الرقم القومي مسجل مسبقاً في المسابقة.');
                        resetSubmitBtn();
                        return;
                    }

                    const nameCheck = await db.collection('registrations')
                        .where('studentName', '==', studentName)
                        .limit(1)
                        .get();

                    if (!nameCheck.empty) {
                        alert('⚠️ عذراً، هذا الاسم مسجل مسبقاً في أحد المستويات.');
                        resetSubmitBtn();
                        return;
                    }
                }

                // --- 3. File Upload handling ---
                if (btnText) btnText.textContent = 'جاري رفع الصور...';

                const uploadFormData = new FormData();
                const idFile = document.getElementById('idFile')?.files[0];
                const photoFile = document.getElementById('personalPhoto')?.files[0];

                if (idFile) uploadFormData.append('birth_cert', idFile);
                if (photoFile) uploadFormData.append('personal_photo', photoFile);

                let uploadedFiles = {};
                if (idFile || photoFile) {
                    const uploadResponse = await fetch('upload.php', {
                        method: 'POST',
                        body: uploadFormData
                    });
                    const uploadResult = await uploadResponse.json();
                    if (uploadResult.success) {
                        uploadedFiles = uploadResult.files;
                    } else {
                        throw new Error('فشل رفع الصور: ' + uploadResult.error);
                    }
                }

                // 4. Prepare Data for Firestore
                const registrationData = {
                    studentName,
                    nationalID,
                    ageYears: ageInfo.years,
                    ageMonths: ageInfo.months,
                    ageDays: ageInfo.days,
                    birthDate: ageInfo.birthDate,
                    formattedAge: ageInfo.formattedAge,
                    gender: formData.get('gender'),
                    phone1: formData.get('phone1'),
                    phone2: formData.get('phone2'),
                    phone3: formData.get('phone3'),
                    address: formData.get('address'),
                    sheikhName: formData.get('sheikhName'),
                    sheikhPhone: formData.get('sheikhPhone'),
                    level: formData.get('level'),
                    birthCertPath: uploadedFiles.birth_cert || '',
                    personalPhotoPath: uploadedFiles.personal_photo || '',
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                };

                if (isFirebaseConfigured && db) {
                    if (btnText) btnText.textContent = 'جاري حجز رقم الجلوس...';

                    const counterRef = db.collection('counters').doc(`${registrationData.gender}_${registrationData.level}`);

                    const seatNumber = await db.runTransaction(async (transaction) => {
                        const counterDoc = await transaction.get(counterRef);
                        let count = 0;
                        if (counterDoc.exists) {
                            count = counterDoc.data().count;
                        }

                        const ranges = {
                            'بنين': {
                                'المستوى الأول (القرآن كاملاً)': 4000,
                                'المستوى الثاني (ثلاثة أرباع القرآن)': 4301,
                                'المستوى الثالث (نصف القرآن)': 4801,
                                'المستوى الرابع (ربع القرآن)': 5501,
                                'المستوى الخامس (البراعم - 5 أجزاء)': 1
                            },
                            'بنات': {
                                'المستوى الأول (القرآن كاملاً)': 2000,
                                'المستوى الثاني (ثلاثة أرباع القرآن)': 2301,
                                'المستوى الثالث (نصف القرآن)': 2801,
                                'المستوى الرابع (ربع القرآن)': 3501,
                                'المستوى الخامس (البراعم - 5 أجزاء)': 1001
                            }
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

                    // Success UI update
                    document.getElementById('displayStudentName').textContent = studentName;
                    document.getElementById('displaySeatNumber').textContent = seatNumber.assignedSeat;
                    const committeeDisplay = document.getElementById('displayCommittee');
                    if (committeeDisplay) committeeDisplay.textContent = seatNumber.committeeNumber;

                    document.getElementById('confirmationModal').style.display = 'flex';
                }

                localStorage.setItem(`registered_id_${nationalID}`, 'true');
                registrationForm.reset();
                if (agreeTerms) agreeTerms.checked = false;

                // Reset file upload UI
                fileInputs.forEach(input => {
                    const container = input.closest('.custom-file-upload');
                    if (container) container.classList.remove('has-file');
                    const textSpan = container ? container.querySelector('.file-text') : null;
                    if (textSpan) textSpan.textContent = input.id === 'idFile' ? 'اختر صورة شهادة الميلاد' : 'اختر الصورة الشخصية';
                });

            } catch (error) {
                console.error("Submission Error:", error);
                alert('حدث خطأ أثناء الإرسال: ' + error.message);
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
    let visibleCount = 4;

    // Initially hide images beyond the first 5
    const updateGalleryVisibility = () => {
        galleryItems.forEach((item, index) => {
            if (index < visibleCount) {
                item.classList.remove('hidden');
                item.style.display = 'block';
            } else {
                item.classList.add('hidden');
                item.style.display = 'none';
            }
        });

        if (visibleCount >= galleryItems.length) {
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        }
    };

    updateGalleryVisibility();

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            visibleCount += 5; // Show 5 more
            updateGalleryVisibility();
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
    // --- OCR Birth Certificate Extraction (Advanced Version) ---
    const scanIDBtn = document.getElementById('scanIDBtn');
    const idFile = document.getElementById('idFile');
    const ocrStatus = document.getElementById('ocrStatus');
    const nationalIDInput = document.getElementById('nationalID');
    const studentNameInput = document.getElementById('studentName');

    if (scanIDBtn && idFile) {
        scanIDBtn.addEventListener('click', () => {
            // Reset fields before scanning
            nationalIDInput.value = "";
            ocrStatus.style.display = 'block';
            ocrStatus.innerHTML = '<span class="ocr-loader"><i class="fas fa-spinner fa-spin"></i> افتح الكاميرا أو اختر صورة واضحة...</span>';
            idFile.click();
        });

        idFile.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            ocrStatus.innerHTML = '<span class="ocr-loader"><i class="fas fa-spinner fa-spin"></i> جاري تحسين جودة الصورة...</span>';

            try {
                // Advanced Pre-processing
                const processedImg = await preprocessImage(file);

                ocrStatus.innerHTML = '<span class="ocr-loader"><i class="fas fa-spinner fa-spin"></i> جاري قراءة البيانات... (0%)</span>';

                const result = await Tesseract.recognize(processedImg, 'ara+eng', {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            const progress = Math.round(m.progress * 100);
                            ocrStatus.innerHTML = `<span class="ocr-loader"><i class="fas fa-spinner fa-spin"></i> جاري قراءة البيانات... (${progress}%)</span>`;
                        }
                    }
                });

                const fullText = result.data.text;
                console.log("OCR Extracted Text:", fullText);

                // --- 1. National ID Extraction ---
                // Clean the text from any spaces between digits
                const digitsOnly = fullText.replace(/\s/g, '');
                const idMatch = digitsOnly.match(/\d{14}/);
                let foundID = idMatch ? idMatch[0] : null;

                // --- 2. Advanced Name Extraction ---
                const cleanLines = fullText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                let childFirstName = "";
                let fatherName = "";

                for (let i = 0; i < cleanLines.length; i++) {
                    const line = cleanLines[i];

                    // Look for Child's Name (اسم المولود)
                    if (line.includes('اسم المولود') || line.includes('المولود')) {
                        childFirstName = line.replace(/.*(اسم المولود|المولود)[:\/\- ]+/, '').trim();
                        // Filter for Arabic only
                        childFirstName = childFirstName.replace(/[^\u0600-\u06FF\s]/g, '').trim();

                        // If current line is too short, check next line
                        if (childFirstName.split(' ').length < 1 && i + 1 < cleanLines.length) {
                            childFirstName = cleanLines[i + 1].replace(/[^\u0600-\u06FF\s]/g, '').trim();
                        }
                    }

                    // Look for Father's Name (اسم الأب)
                    if (line.includes('اسم الأب') || line.includes('الأب')) {
                        fatherName = line.replace(/.*(اسم الأب|الأب)[:\/\- ]+/, '').trim();
                        fatherName = fatherName.replace(/[^\u0600-\u06FF\s]/g, '').trim();

                        if (fatherName.split(' ').length < 2 && i + 1 < cleanLines.length) {
                            fatherName = cleanLines[i + 1].replace(/[^\u0600-\u06FF\s]/g, '').trim();
                        }
                    }
                }

                // Fallback for Name if specific labels failed
                let detectedFullName = "";
                if (childFirstName && fatherName) {
                    detectedFullName = (childFirstName + ' ' + fatherName).trim();
                } else {
                    // Look for any line that looks like a 4-segment Arabic name
                    for (const line of cleanLines) {
                        const words = line.replace(/[^\u0600-\u06FF\s]/g, '').trim().split(/\s+/);
                        if (words.length >= 4) {
                            detectedFullName = words.slice(0, 4).join(' ');
                            break;
                        }
                    }
                }

                let feedback = "";
                if (foundID) {
                    nationalIDInput.value = foundID;
                    nationalIDInput.dispatchEvent(new Event('input'));
                    feedback += `<div style="color: #2e7d32; font-weight: bold;"><i class="fas fa-check-circle"></i> تم التقاط الرقم القومي بنجاح</div>`;
                }

                if (detectedFullName) {
                    studentNameInput.value = detectedFullName;
                    feedback += `<div style="color: #2e7d32; font-weight: bold;"><i class="fas fa-check-circle"></i> تم التقاط الاسم: ${detectedFullName}</div>`;
                }

                if (!foundID || !detectedFullName) {
                    feedback = `<div style="color: #d32f2f; background: rgba(211, 47, 47, 0.05); padding: 10px; border-radius: 8px; font-size: 0.9rem;">
                                    <i class="fas fa-exclamation-triangle"></i> حدث خطأ في القراءة التلقائية.<br>
                                    يرجى التأكد من أن الصورة واضحة تماماً ولا يوجد بها اهتزاز، ثم حاول مرة أخرى.
                                </div>`;
                } else {
                    feedback += '<div style="font-size: 0.8rem; color: #666; margin-top: 5px;">* برجاء التأكد من صحة البيانات المستخرجة.</div>';
                }

                ocrStatus.innerHTML = feedback;

            } catch (err) {
                console.error("OCR Error:", err);
                ocrStatus.innerHTML = '<div style="color: #d32f2f;"><i class="fas fa-times-circle"></i> تعذر معالجة الصورة. يرجى المحاولة بصورة أكثر وضوحاً.</div>';
            }
        });
    }

    /**
     * Preprocesses the image to improve OCR results
     */
    async function preprocessImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Limit size for performance but keep enough detail
                    const maxDim = 1500;
                    let width = img.width;
                    let height = img.height;

                    if (width > maxDim || height > maxDim) {
                        if (width > height) {
                            height = (height / width) * maxDim;
                            width = maxDim;
                        } else {
                            width = (width / height) * maxDim;
                            height = maxDim;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    // Draw to canvas
                    ctx.drawImage(img, 0, 0, width, height);

                    // 1. Grayscale & Contrast
                    const imageData = ctx.getImageData(0, 0, width, height);
                    const data = imageData.data;

                    for (let i = 0; i < data.length; i += 4) {
                        // Standard Grayscale
                        const grayscale = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;

                        // Increase Contrast (thresholding)
                        let val = grayscale;
                        if (val > 180) val = 255;
                        else if (val < 100) val = 0;

                        data[i] = data[i + 1] = data[i + 2] = val;
                    }

                    ctx.putImageData(imageData, 0, 0);
                    resolve(canvas.toDataURL('image/jpeg', 0.9));
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // --- Real-time Age Calculation & Display ---
    const ageDisplay = document.getElementById('ageDisplay');
    const ageText = document.getElementById('ageText');
    if (nationalIDInput && ageDisplay && ageText) {
        nationalIDInput.addEventListener('input', () => {
            const idValue = nationalIDInput.value.trim();
            if (idValue.length === 14) {
                const ageInfo = calculateAgeFromID(idValue);
                if (ageInfo) {
                    ageDisplay.style.display = 'block';
                    ageText.textContent = `العمر: ${ageInfo.formattedAge}`;
                    if (ageInfo.years > 15) {
                        ageText.style.color = '#d32f2f';
                        ageText.innerHTML += ' <br> ⚠️ عذراً، السن تجاوز 15 عاماً (مخالف للشروط)';
                    } else {
                        ageText.style.color = '#2e7d32';
                    }
                } else {
                    ageDisplay.style.display = 'none';
                }
            } else {
                ageDisplay.style.display = 'none';
            }
        });
    }
});
