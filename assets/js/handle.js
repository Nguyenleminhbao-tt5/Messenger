/* handle event login - register  */

/* Toggle */

document.querySelector('.register-btn').addEventListener('click',()=>
{
    document.querySelector('.Login').classList.remove('see');
    document.querySelector('.Register').classList.add('see');
    document.querySelector('.modal__body').classList.add('reduceH');
    

});


document.querySelector('.login-btn').addEventListener('click',()=>
{
    document.querySelector('.Register').classList.remove('see');
    document.querySelector('.Login').classList.add('see');
    document.querySelector('.modal__body').classList.remove('reduceH');

});
document.querySelector('.return').addEventListener('click',()=>
{
    document.querySelector('.Register').classList.remove('see');
    document.querySelector('.Login').classList.add('see');

});

/* save list User register*/
let listUser=[];
document.querySelector('.REGISTER').addEventListener('click',()=>
{
    const obj=
    {
        name: document.querySelector('.NAME').value,
        password: document.querySelector('.PASSWORD').value,
        avatar:document.querySelector('.avaUser').value
    };
    let flag=true;
    listUser.forEach(user=>
        {
            if(user.name==obj.name && user.password==obj.password)
            {
                alert('Tài khoản này đã tồn tại');
                flag=false;
            }

        })
    
    if(flag)
    {
        console.log('Đăng kí thành công');
        listUser.push(obj);
        document.querySelector('.Register').classList.remove('see');
        document.querySelector('.Login').classList.add('see');
    }
});

document.querySelector('.LOGIN').addEventListener('click',()=>
{
    const name=document.querySelector('.NAME1').value;
    const password=document.querySelector('.PASSWORD1').value;
    
    let flag =true;
    listUser.forEach(user=>
        {
            if(user.name==name && user.password==password)
            {
                console.log('Đăng nhập thành công');
                document.querySelector('.modal').classList.remove('see');
                document.querySelector('.appchat').classList.add('see');

                flag=false;
            }

        })
    
    if(flag) 
    {
        if(name=='' && password=='') alert(' Đăng nhập thất bại, xin bạn hãy nhập tài khoản');
        else if (name!='' && password=='') alert(' Đăng nhập thất bại, xin bạn hãy nhập mật khẩu');
        else if (name=='' && password!='') alert(' Đăng nhập thất bại, xin bạn hãy nhập tên');
        else alert(' Đăng nhập thất bại, xin bạn nhập đúng tài khoản');
    }
    else
    {
        alert(' Đăng nhập thành công');
        document.querySelector('.LgRr').classList.remove('see');
        document.querySelector('.appchat').classList.add('see');
    }
});





function confirmLogin()
{
  console.log('change');
}