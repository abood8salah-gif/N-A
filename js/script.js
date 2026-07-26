// ======================================
// ELEMENTS
// ======================================

const loader = document.getElementById("loader");

const poster = document.getElementById("videoPoster");

const video = document.getElementById("bgVideo");

const hero = document.querySelector(".hero");

const invitation = document.getElementById("invitationContent");

const button = document.getElementById("openInvitation");

const music = document.getElementById("bgMusic");

// ======================================
// INITIAL STATE
// ======================================

if (invitation) {

    invitation.style.display = "none";

    invitation.style.opacity = "0";

}

document.body.style.overflow = "hidden";
// ======================================
// LOADER
// ======================================

window.addEventListener("load", () => {

    if (!loader) return;

    setTimeout(() => {

        loader.style.opacity = "0";

        setTimeout(() => {

            loader.style.display = "none";

        }, 1000);

    }, 1800);

});
// ======================================
// OPEN INVITATION
// ======================================

if (button) {

    button.addEventListener("click", () => {
        if (music && music.paused) {

    music.volume = 0.35;

    music.play().catch(() => {});

}

        // إخفاء الصفحة الأولى

        hero.style.transition = "opacity 1s ease";

        hero.style.opacity = "0";

        // بعد الاختفاء

        setTimeout(() => {

            // إخفاء البوستر

            poster.style.opacity = "0";

            // إظهار الفيديو

            video.style.opacity = "1";

            // بدء الفيديو من البداية

            video.currentTime = 0;

            video.play().catch(() => {});

        }, 700);

    });

}
// ======================================
// VIDEO FINISHED
// ======================================

video.addEventListener("ended", () => {

    // إخفاء شاشة البداية

    hero.style.display = "none";

    // إظهار الدعوة

    invitation.style.display = "block";

    setTimeout(() => {

        invitation.style.opacity = "1";

    }, 50);

    // السماح بالسكرول

    document.body.style.overflowY = "auto";

  

    // إظهار قسم الترحيب

    const welcome = document.querySelector(".welcome-content");

    if (welcome) {

        setTimeout(() => {

            welcome.classList.add("show");

        }, 300);

    }

    // الرجوع لأول الصفحة

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});
// ======================================
// CINEMATIC LOOP
// ======================================

let cinematicFinished = false;

video.addEventListener("timeupdate", () => {

    // إذا انتهى الفيديو وخلاص دخلنا الدعوة
    if (cinematicFinished) return;

    // قبل النهاية بـ 1.5 ثانية
    if (video.currentTime >= video.duration - 1.5) {

        cinematicFinished = true;

    }

});

// بعد انتهاء الفيديو
video.addEventListener("ended", () => {

    // يبقى الفيديو آخر فريم فقط
    video.pause();

});

// ======================================
// SCROLL ANIMATION
// ======================================

const fadeSections = document.querySelectorAll(".fade-section");

const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},{

    threshold:.2

});

fadeSections.forEach(section=>{

    observer.observe(section);

});
// ======================================
// PETALS
// ======================================

const petals = document.getElementById("petals");

if(petals){

    setInterval(()=>{

        const petal=document.createElement("div");

        petal.className="petal";

        petal.innerHTML="🌸";

        petal.style.left=Math.random()*100+"vw";

        petal.style.animationDuration=(6+Math.random()*5)+"s";

        petal.style.opacity=Math.random();

        petal.style.fontSize=(18+Math.random()*18)+"px";

        petals.appendChild(petal);

        setTimeout(()=>{

            petal.remove();

        },12000);

    },450);

}
// ======================================
// COUNTDOWN
// ======================================

const weddingDate=new Date("2026-08-21T17:00:00").getTime();

setInterval(()=>{

    const now=new Date().getTime();

    const distance=weddingDate-now;

    if(distance<0)return;

    const days=Math.floor(distance/(1000*60*60*24));

    const hours=Math.floor((distance%(1000*60*60*24))/(1000*60*60));

    const minutes=Math.floor((distance%(1000*60*60))/(1000*60));

    const seconds=Math.floor((distance%(1000*60))/1000);

    document.getElementById("days").innerHTML=days;

    document.getElementById("hours").innerHTML=hours;

    document.getElementById("minutes").innerHTML=minutes;

    document.getElementById("seconds").innerHTML=seconds;

},1000);
// اختيار الحضور

const attendanceBtns=document.querySelectorAll(".attendance-btn");

const attendanceInput=document.getElementById("attendance");

attendanceBtns.forEach(btn=>{

btn.onclick=()=>{

attendanceBtns.forEach(b=>b.classList.remove("active"));

btn.classList.add("active");

attendanceInput.value=btn.dataset.value;

};

});

// العداد

let companions=0;

const count=document.getElementById("count");

document.getElementById("plus").onclick=()=>{

companions++;

count.textContent=companions;

};

document.getElementById("minus").onclick=()=>{

if(companions>0){

companions--;

count.textContent=companions;

}

};
// ======================================
// SEND RSVP TO GOOGLE SHEETS
// ======================================

const rsvpForm = document.getElementById("rsvpForm");

if (rsvpForm) {

    rsvpForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const data = {

            name: document.getElementById("guestName").value,

            attendance: document.getElementById("attendance").value,

            companions: document.getElementById("count").textContent,

            message: document.getElementById("message").value

        };

        try {

const response = await fetch("https://script.google.com/macros/s/AKfycbyhlcpkm_LXOH-pLHPT71PudcvqMJF4Yq-aiR8nl5IqRq19tRNLYqvnt7dJTtDQGBdK/exec", {
    method: "POST",
    headers: {
        "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(data)
});

            const result = await response.json();

            if (result.success) {

                alert("تم إرسال تأكيد حضورك بنجاح 🤍");

                rsvpForm.reset();

                document.getElementById("count").textContent = "0";

                companions = 0;

            }

        } catch (err) {

            console.error(err);

            alert("حدث خطأ أثناء الإرسال");

        }

    });

}