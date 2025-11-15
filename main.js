firebase.initializeApp(firebaseConfig);
const auth=firebase.auth(); const db=firebase.firestore();

// AES XOR-like
function encrypt(t,k){return btoa([...t].map((c,i)=>String.fromCharCode(c.charCodeAt(0)^k.charCodeAt(i%k.length))).join(''));}
function decrypt(t,k){let d=atob(t);return [...d].map((c,i)=>String.fromCharCode(c.charCodeAt(0)^k.charCodeAt(i%k.length))).join('');}
const SECRET_KEY="B25_SECRET_2025";

document.addEventListener('DOMContentLoaded',()=>{
 if(location.pathname.includes('index')){
  document.getElementById('loginBtn').onclick=async()=>{
   let e=email.value,p=password.value;
   try{
    await auth.signInWithEmailAndPassword(e,p);
    if(auth.currentUser.email===ADMIN_EMAIL)location.href='dashboard.html';
    else{auth.signOut();loginMsg.textContent='غير مصرح';}
   }catch(err){loginMsg.textContent='خطأ';}
  };
 }

 if(location.pathname.includes('dashboard')){
  logoutBtn.onclick=()=>auth.signOut().then(()=>location.href='index.html');
  addBtn.onclick=addCredential;
  auth.onAuthStateChanged(u=>{ if(!u)location.href='index.html'; else loadList();});
 }
});

async function addCredential(){
 let site=document.getElementById('site').value.trim();
 let uname=document.getElementById('uname').value.trim();
 let upass=document.getElementById('upass').value.trim();
 if(!site||!uname||!upass){addMsg.textContent='املأ الحقول';return;}
 let enc=encrypt(upass,SECRET_KEY);
 await db.collection(CREDS_COLLECTION).add({site,uname,upass:enc,createdAt:firebase.firestore.FieldValue.serverTimestamp()});
 addMsg.textContent='تمت الإضافة';
}

function loadList(){
 db.collection(CREDS_COLLECTION).orderBy('createdAt','desc').onSnapshot(s=>{
  list.innerHTML=''; s.forEach(doc=>renderItem(doc));
 });
}

function renderItem(doc){
 let d=doc.data(); let dec=decrypt(d.upass,SECRET_KEY);
 let div=document.createElement('div'); div.className='cred';
 div.innerHTML=`<b>${d.site}</b><br>${d.uname} : ${dec}<br><button data-id="${doc.id}" class="delBtn">حذف</button>`;
 list.appendChild(div);
 div.querySelector('.delBtn').onclick=()=>db.collection(CREDS_COLLECTION).doc(doc.id).delete();
}