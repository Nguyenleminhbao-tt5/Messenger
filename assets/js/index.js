  
  // Create 1 socket (client)
    const socket = io({transports: ['websocket'],});

    // button like ||document.querySelector("#file").value != ''
    setInterval(()=>{
      console.log('có');
      if(document.getElementById('yourMessage').value !='' || document.querySelector("#file").value != '' )
    {
      document.querySelector('.sendLike').classList.remove('see');
      document.querySelector('.sendMess').classList.add('see');
    }
    else{
      document.querySelector('.sendMess').classList.remove('see');
      document.querySelector('.sendLike').classList.add('see');
    }
    },500);
    

    // GET NAME
    let listFile=[];
    let user={
      name:'',
      urlAvatar:''
    };

    document.querySelector('.PASSWORD1').addEventListener('change',()=>{
      user.name=document.querySelector('.nameUser').value;
      user.urlAvatar=document.querySelector('.avaUser').value;
      if(user.name==='') user.name='User';
      if(user.urlAvatar==='') user.urlAvatar='https://thuthuatnhanh.com/wp-content/uploads/2022/01/Avatar-Tet-doi-dang-yeu-cho-nu.jpg';

      document.getElementById('headingName').innerHTML=`Messager của ${user.name}`;
      // add 1 name client to server
      appendFriend(user);
      socket.emit('addName',user.name);
    
    });
      
     
    

     // create arr object room

     const Rooms=[
      {
        name:'CHAT TỔNG',
        img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_IcgTrUVITbkuoqzhg0usF1GUmIXtc0OqXg&usqp=CAU'
      },
      {
        name:'ROOM 1',
        img:'https://i.pinimg.com/736x/2f/1b/8e/2f1b8ec62f36a424aed23f8583e72376.jpg'
      },
      {
        name:'ROOM 2',
        img:'https://khoinguonsangtao.vn/wp-content/uploads/2022/07/avatar-cute-2.jpg'
      },
      {
        name:'ROOM 3',
        img:'https://i.pinimg.com/736x/d7/46/92/d746925076f7acef40bc89a27ad40b9a.jpg'
      },
      {
        name:'ROOM 4',
        img:'https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2022/04/Anh-cute.jpg?ssl=1'
      },
      {
        name:'ROOM 5',
        img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxnWiTBbnxcUN3yJQXCBKV4fm1AqnzvCy1KQ&usqp=CAU'
      },
      {
        name:'ROOM 6',
        img:'https://i.pinimg.com/736x/2f/1b/8e/2f1b8ec62f36a424aed23f8583e72376.jpg'
      }
    ];

    // function endLine
    function endLine()
    {
      document.getElementById('messages').appendChild(document.createElement('br'));
      document.getElementById('messages').appendChild(document.createElement('br')); 
    }
    //SEND MESSAGE

    //join room
    document.getElementById('joinRoom').addEventListener('click',()=>
    {
      const room=document.getElementById('yourRoom').value;
      console.log(`Kết nối tới room: ${room}`);
      socket.emit('joinRoom',room);
    })
    //leave room
    document.getElementById('leaveRoom').addEventListener('click',()=>
    {
      if(document.getElementById('yourRoom').value!=='')
      {
        console.log(`Rời phòng ${document.getElementById('yourRoom').value}`);
        
        document.getElementById('messages').innerHTML='';
        document.querySelector('.active-name').innerHTML=Rooms[0].name;
        document.querySelector('.avatar__img1').setAttribute('src',Rooms[0].img);


        const mess=document.createElement('li');
        mess.classList.add('liLeft');
        mess.innerHTML=
        `<div class="status-avatar1">
            <img class="avatar__img2" src="${user.urlAvatar}">
          </div>
          <span class="content-mess">${user.name} đã rời chat ${ document.getElementById('yourRoom').value}</span>
          <span class="avatar__name">${user.name}</span>`;
        document.getElementById('messages').appendChild(mess);
        
        endLine();

        // send message 
        let room='';
        if(document.getElementById('yourRoom')!==null) room=document.getElementById('yourRoom').value
        socket.emit('sendMessage',`${user.name} đã rời chat ${ document.getElementById('yourRoom').value}`,user,room);
        document.getElementById('yourRoom').value='';
      }
    })
    // receive messages
    socket.on('receiveMessage',(data,user1)=>
    {
      if (data.includes('likeR'))
      {
        const mess=document.createElement('li');
        mess.classList.add('liLeft');
        mess.innerHTML=data;
        document.getElementById('messages').appendChild(mess);
        endLine();
      }
      else if(data!='')
      {
        const mess=document.createElement('li');
        mess.classList.add('liLeft');
        mess.innerHTML=
        `<div class="status-avatar1">
            <img class="avatar__img2" src="${user1.urlAvatar}">
          </div>
          <span class="content-mess">${data}</span>
          <span class="avatar__name">${user1.name}</span>`;
        document.getElementById('messages').appendChild(mess);
        endLine();
      }
    })
    
    // recall messages
    socket.on('recallMess',(mess,data)=>
    {
      document.querySelectorAll('.content-mess').forEach(item=>
        {

          if(item.innerHTML===data) 
          {
            item.innerHTML=mess;
          }
        });
    })

    // SEND FILE
    
    // download file
    const downloadFile = (filename, fileurl) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', fileurl, true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
            if (this.status == 200) {
                var myBlob = this.response;
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(myBlob);
                link.download = filename;
                link.click();
            }
        };
        xhr.send();
    }

   
    // append HTML
    const appendHTML = (msg,user1,pos) => {

        const fileName = JSON.parse(msg)[0];
        const fileUrl = JSON.parse(msg)[1];

        listFile.push({
          fileName: fileName,
          fileUrl: fileUrl
        })
        console.log(listFile);
        if(pos=='liRight')
        {
          const li= document.createElement('li');
          li.classList.add(pos);
          li.classList.add('file');
          li.innerHTML=
          ` <button class='file-btn' >
            <svg viewBox="0 0 36 36" class="file-icon" fill="currentColor" height="24" width="24"><path clip-rule="evenodd" d="M18 8c0-.6-.4-1-1-1h-6a2 2 0 00-2 2v18c0 1.1.9 2 2 2h14a2 2 0 002-2V17c0-.6-.4-1-1-1h-4a4 4 0 01-4-4V8zm-6 7c0-.6.4-1 1-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm1 3.5a1 1 0 100 2h10a1 1 0 100-2H13zm0 4.5a1 1 0 100 2h10a1 1 0 100-2H13z" fill-rule="evenodd"></path><path d="M22 14h4a1 1 0 00.7-1.7l-5-5A1 1 0 0020 8v4c0 1.1.9 2 2 2z"></path></svg>
            <span>${fileName}</span>
            <span id='bin'>${fileUrl}</span>
          </button>
          `;
          document.getElementById('messages').appendChild(li);  
        }
        else if(pos=='liLeft')
        {
          const li= document.createElement('li');
          li.classList.add(pos);
          li.innerHTML=
          `<div class="status-avatar1">
            <img class="avatar__img2" src="${user1.urlAvatar}">
          </div> 
          <button class="file-btn file" >
            <svg viewBox="0 0 36 36" class="file-icon" fill="currentColor" height="24" width="24"><path clip-rule="evenodd" d="M18 8c0-.6-.4-1-1-1h-6a2 2 0 00-2 2v18c0 1.1.9 2 2 2h14a2 2 0 002-2V17c0-.6-.4-1-1-1h-4a4 4 0 01-4-4V8zm-6 7c0-.6.4-1 1-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm1 3.5a1 1 0 100 2h10a1 1 0 100-2H13zm0 4.5a1 1 0 100 2h10a1 1 0 100-2H13z" fill-rule="evenodd"></path><path d="M22 14h4a1 1 0 00.7-1.7l-5-5A1 1 0 0020 8v4c0 1.1.9 2 2 2z"></path></svg>
            <span>${fileName}</span>
            <span id='bin'>${fileUrl}</span>
          </button>
          <span class="avatar__name">${user1.name}</span>
          `;
          document.getElementById('messages').appendChild(li);
        }
        const Files=document.querySelectorAll('.file-btn'); 
        Files[Files.length -1].addEventListener("click", () => downloadFile(fileName, fileUrl));

        endLine();
        window.scrollTo(0, document.body.scrollHeight);

      }
    

    // save list file
    var form = document.getElementById('form');
    var input = '';

    // keypress - enter
    document.getElementById('yourMessage').addEventListener('keypress',e=>
    {
      if(e.key==='Enter')
      {
        e.preventDefault();
        document.querySelector('.sendMess').click();
      }
    });
    // event send (mess, file, icon-like)
    const sendfunc = () => {
      // send like
      if(document.getElementById('yourMessage').value=='' && document.querySelector("#file").value == ''  )
      {
        console.log('like');
        const data=
        `
          <div class="status-avatar1">
            <img class="avatar__img2" src="https://thuthuatnhanh.com/wp-content/uploads/2022/01/Avatar-Tet-doi-dang-yeu-cho-nu.jpg">
          </div>
          <span class="likeR">
              <svg aria-labelledby="js_2f" height="120%" viewBox="0 0 16 16" width="100%"><title id="js_2f">Ký hiệu giơ ngón tay cái</title><path d="M16,9.1c0-0.8-0.3-1.1-0.6-1.3c0.2-0.3,0.3-0.7,0.3-1.2c0-1-0.8-1.7-2.1-1.7h-3.1c0.1-0.5,0.2-1.3,0.2-1.8 c0-1.1-0.3-2.4-1.2-3C9.3,0.1,9,0,8.7,0C8.1,0,7.7,0.2,7.6,0.4C7.5,0.5,7.5,0.6,7.5,0.7L7.6,3c0,0.2,0,0.4-0.1,0.5L5.7,6.6 c0,0-0.1,0.1-0.1,0.1l0,0l0,0L5.3,6.8C5.1,7,5,7.2,5,7.4v6.1c0,0.2,0.1,0.4,0.2,0.5c0.1,0.1,1,1,2,1h5.2c0.9,0,1.4-0.3,1.8-0.9 c0.3-0.5,0.2-1,0.1-1.4c0.5-0.2,0.9-0.5,1.1-1.2c0.1-0.4,0-0.8-0.2-1C15.6,10.3,16,9.9,16,9.1z" fill="#0084ff"></path><path d="M3.3,6H0.7C0.3,6,0,6.3,0,6.7v8.5C0,15.7,0.3,16,0.7,16h2.5C3.7,16,4,15.7,4,15.3V6.7C4,6.3,3.7,6,3.3,6z" fill="#0084ff"></path></svg>
          </span>
          <span class="avatar__name">User</span>
        `;
        document.getElementById('yourMessage').value='';
        let room='';
        if(document.getElementById('yourRoom')!==null) room=document.getElementById('yourRoom').value

        socket.emit('sendMessage',data,user,room);
        const mess=document.createElement('li');
        mess.classList.add('liRight');
        mess.innerHTML=
        `<span class="likeL">
        <svg aria-labelledby="js_2f" height="120%" viewBox="0 0 16 16" width="100%"><title id="js_2f">Ký hiệu giơ ngón tay cái</title><path d="M16,9.1c0-0.8-0.3-1.1-0.6-1.3c0.2-0.3,0.3-0.7,0.3-1.2c0-1-0.8-1.7-2.1-1.7h-3.1c0.1-0.5,0.2-1.3,0.2-1.8 c0-1.1-0.3-2.4-1.2-3C9.3,0.1,9,0,8.7,0C8.1,0,7.7,0.2,7.6,0.4C7.5,0.5,7.5,0.6,7.5,0.7L7.6,3c0,0.2,0,0.4-0.1,0.5L5.7,6.6 c0,0-0.1,0.1-0.1,0.1l0,0l0,0L5.3,6.8C5.1,7,5,7.2,5,7.4v6.1c0,0.2,0.1,0.4,0.2,0.5c0.1,0.1,1,1,2,1h5.2c0.9,0,1.4-0.3,1.8-0.9 c0.3-0.5,0.2-1,0.1-1.4c0.5-0.2,0.9-0.5,1.1-1.2c0.1-0.4,0-0.8-0.2-1C15.6,10.3,16,9.9,16,9.1z" fill="#0084ff"></path><path d="M3.3,6H0.7C0.3,6,0,6.3,0,6.7v8.5C0,15.7,0.3,16,0.7,16h2.5C3.7,16,4,15.7,4,15.3V6.7C4,6.3,3.7,6,3.3,6z" fill="#0084ff"></path></svg>
        </span>`;
        document.getElementById('messages').appendChild(mess);
        endLine();
        
      }

       // send messages
       if(document.getElementById('yourMessage').value!='')
       {
         const data=document.getElementById('yourMessage').value;
         document.getElementById('yourMessage').value='';
         let room='';
         if(document.getElementById('yourRoom')!==null) room=document.getElementById('yourRoom').value
 
         socket.emit('sendMessage',data,user,room);
         const mess=document.createElement('li');
         mess.classList.add('liRight');
         mess.innerHTML=
         `<button class="recall">
         <img class="icon-recall" src="./assets/img/remove.png">
         </button>
         <span class="content-mess1">${data}</span>`;
         document.getElementById('messages').appendChild(mess);
         endLine();
         
         // event recall messages
         let listRecall= document.querySelectorAll('.recall');
         listRecall[listRecall.length-1].addEventListener('click',()=>
         {
           document.querySelectorAll('.content-mess1').forEach(item=>
             {
               if(item.innerHTML===data) 
               {
                 item.innerHTML='Bạn đã thu hồi tin nhắn';
                 socket.emit('recall',`${user.name} đã thu hồi tin nhắn`,data,room);
               }
             });
         })
       }

      console.log("sending...");
      socket.emit('sending');

      // no file selected to read
      if (document.querySelector("#file").value == '') {
        console.log('No file selected');
         return;
      }
      else // send file
      {
        var file = document.querySelector("#file").files[0];
        var reader = new FileReader();

        reader.onload = function(e) {
        // binary data
        input = JSON.stringify([file.name, e.target.result]);
        if (input) {
          const room=document.getElementById('yourRoom').value;
          socket.emit('sendFile', input,user,room);
          appendHTML(input,user,'liRight');
          input = '';
          socket.emit('finished sending');
          console.log("finished sending");
          }
        };

        reader.onerror = function(e) {
        // error occurred
        console.log('Error : ' + e.type);
        };
        reader.readAsDataURL(file);
        document.querySelector("#file").value = '';
      }

    };

    //receive file
    socket.on('receiveFile',(msg,user1)=>{
      if(msg)
      {   
        appendHTML(msg,user1,'liLeft');
        
      }
        });
    

    form.addEventListener('submit', function(e) {
        e.preventDefault();
    });


   // socket.on("give messages", () => socket.emit("take messages", JSON.stringify(messages_list)))
    socket.on('init', (msg) => console.log(msg));
    socket.on('user disconnect', (msg) => console.log(msg));
    socket.on("will disconnect all", () => alert("Files total size exceeds maximum. Disconnected"))
    
    // loading file
    socket.on('loading', () => {
        console.log("loading");
        var loading = document.getElementById('loading');
        loading.textContent = "LOADING";
    });

    // stop loading file
    socket.on('stop loading', () => {
        console.log("loading finished");
        var loading = document.getElementById('loading');
        loading.textContent = "";
    });

    // append list friend
    function appendFriend(user)
    {
      const list = document.getElementById('listFriend');
      const li = document.createElement('li');
      li.classList.add('listFriend__item');
      li.innerHTML=`
      <div class="listFriend__item-avatar">
        <img class="avatar__img" src='${user.urlAvatar}'>
        <span class="avatar__cir"></span>
      </div>
      <span class="listFriend__item-name">${user.name}</span>
      `;
      list.appendChild(li);
    }
    const listRoom=document.querySelectorAll('.room');


    listRoom.forEach((room,index)=>
    {
      room.addEventListener('click',()=>
      {
        document.getElementById('yourRoom').value=`Room${index+1}`;
        document.getElementById('messages').innerHTML='';
        document.querySelector('.active-name').innerHTML=Rooms[index+1].name;
        document.querySelector('.avatar__img1').setAttribute('src',Rooms[index+1].img);
        
        const mess=document.createElement('li');
        mess.classList.add('liLeft');
        mess.innerHTML=
        `<div class="status-avatar1">
            <img class="avatar__img2" src="${user.urlAvatar}">
          </div>
          <span class="content-mess">${user.name} đã tham gia chat ${ document.getElementById('yourRoom').value}</span>
          <span class="avatar__name">${user.name}</span>`;
        document.getElementById('messages').appendChild(mess);
        endLine();       

        // send message 
        let room='';
        if(document.getElementById('yourRoom')!==null) room=document.getElementById('yourRoom').value
        socket.emit('sendMessage',`${user.name} đã tham gia chat ${ document.getElementById('yourRoom').value}`,user,room);
        document.getElementById('joinRoom').click();
      });
    });
