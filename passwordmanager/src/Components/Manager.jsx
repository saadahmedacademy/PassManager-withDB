import { useState, useEffect } from 'react';
import { MdContentCopy, MdDelete, MdEdit } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import '../Manager.css';
import "react-toastify/dist/ReactToastify.css";


function Manager() {
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    sitename: '',
    username: '',
    password: '',
  });
  const [passwordArry, setPasswordArry] = useState([]);
  
  // To get the db save data
  const fetchData = async () =>{
    const response = await fetch('http://localhost:8000');
    const passwordData = await response.json();
    setPasswordArry(passwordData);
    console.log(passwordData);
  };
   useEffect(() => {
    
    fetchData();
    }, []);

  const showpassIcon = () => setShowPass(!showPass);

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast('Copied the text', {
      position: "top-center",
      autoClose: 7000,
      theme: "dark",
    });
  };

  const savePassword = async (e) => {
    if (form.password === '' || form.username === '' || form.sitename === '' ) {
      toast.error('Please fill complete information!', {
        position: "top-center",
        autoClose: 7000,
        theme: "dark"
      });
    } else {
      let passformData = [...passwordArry, { ...form , id: uuidv4() }];
      setPasswordArry(passformData);
      let response = await fetch('http://localhost:8000', {
        method: "POST",
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({ ...form , id: uuidv4() })
      })
      setForm({ sitename: '', username: '', password: '' });
      toast.success('Save Successfully', {
        position: "top-center",
        autoClose: 7000,
        theme: "dark"
      });
    }
  };

  const deletePassword = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this task?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        content: 'custom-swal-content',
        confirmButton: 'custom-swal-confirm-button',
        cancelButton: 'custom-swal-cancel-button',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        let deletedId = passwordArry.filter(item => item.id !== id)
        
        let response = await fetch('http://localhost:8000', {
          method: "DELETE",
          headers:{
            'Content-Type': 'application/json',
          },
          body:JSON.stringify({id})
        })
        setPasswordArry(passwordArry.filter(item => item.id !== id));
        toast.success('Task deleted successfully!', {
          theme: 'dark',
          position: "top-center",
        });
      } else {
        toast.info('Task not deleted.', {
          theme: 'dark',
          position: "top-center",
        });
      }
    });
  };

  const editPassword = async (id) => {
    if (form.password !== '' || form.username !== '' || form.sitename !== '') {
      toast.error('Please clear all inputs before editing.', {
        position: "top-center",
        autoClose: 7000,
        theme: "dark"
      });
    } else {
      const itemToEdit = passwordArry.find(item => item.id === id);
      setForm(itemToEdit);
      let response = await fetch('http://localhost:8000', {
        method: "DELETE",
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({id})
      })
      setPasswordArry(passwordArry.filter(item => item.id !== id));
    }
  };

  const handleChanged = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <>
      <main className="w-full min-h-screen flex justify-center items-center">

        <section className='myContainer h-full overflow-hidden flex flex-col gap-4 bg-black'>
          <div className='flex flex-col w-full gap-1 items-center'>
            <h1 className="flex gap-1 font-bold sm:text-3xl text-xl">
              <span>&lt;&lt;&lt;</span>
              <span className='text-green-500'>Saad</span>
              <span>Passweb</span>
              <span className="">/&gt;&gt;&gt;</span>
            </h1>
            <h3 className='w-full sm:text-xl text-center'>Your Own Password Manager</h3>
          </div>

          <input type="text" onChange={handleChanged} name='sitename' placeholder='Enter Website URL' value={form.sitename} className='w-full font-bold text-black inputShadow p-2 py-1 rounded-md' />
          <div className='w-full flex sm:flex-nowrap text-black flex-wrap gap-4 justify-center '>
            <input type="text" onChange={handleChanged} name='username' placeholder='Enter Website Name' value={form.username} className='inputShadow font-bold w-full px-4 py-1 rounded-md' />
            <div className="w-full relative">
              <input type={showPass ? "text" : "password"} onChange={handleChanged} name='password' placeholder='Enter Your Password' value={form.password} className='inputShadow font-bold w-full px-4 py-1 rounded-md' />
              <span className='cursor-pointer absolute right-3 top-1 font-serif text-black' onClick={showpassIcon}>
                {showPass ? <FaEyeSlash className='font-bold text-2xl' /> : <FaEye className='font-bold text-2xl' />}
              </span>
            </div>
          </div>

          <button onClick={savePassword} className="flex justify-center items-center gap-3 bg-slate-600 w-fit px-4 py-1 rounded-full font-bold mx-auto hover:border-green-600 hover:border-2 hover:bg-slate-800 ">
            <p>Save</p>
            <lord-icon src="https://cdn.lordicon.com/jgnvfzqg.json" trigger="hover" colors="primary:#16c72e"></lord-icon>
          </button>

          <section className="password">
            <h2 className=" text-xl mb-1 ml-4 font-bold">Your Passwords</h2>
            {passwordArry.length === 0 ? <p className='text-center'>No Passwords Saved</p> :
              <div className="table-wrapper rounded-2xl ">
                <table className="table-auto w-full text-white">
                  <thead className='bg-orange-500 text-xl '>
                    <tr className='px-2'>
                      <th>Website Name</th>
                      <th>User Name</th>
                      <th>Password</th>
                      <th className='px-4'>Actions</th>
                    </tr>
                  </thead>
                  <tbody className='bg-green-700'>
                    {passwordArry.map((items, index) => (
                      <tr key={index} >
                        <td className='overflow-x-hidden'>
                          <span className='flex justify-center gap-2 items-center cursor-pointer font-semibold'>
                            <a target="_blank" href={`${items.sitename}`}>{items.sitename}</a>
                            <MdContentCopy onClick={() => copyText(items.sitename)} />
                          </span>
                        </td>
                        <td className='overflow-x-hidden'>
                          <span className='flex justify-center gap-2 items-center cursor-pointer font-semibold'>
                            {items.username}
                            <MdContentCopy onClick={() => copyText(items.username)} />
                          </span>
                        </td>
                        <td className='overflow-x-hidden'>
                          <span className='flex justify-center gap-2 items-center cursor-pointer font-semibold'>
                            {items.password}
                            <MdContentCopy onClick={() => copyText(items.password)} />
                          </span>
                        </td>
                        <td>
                          <span className='flex justify-center p-2 gap-2 items-center cursor-pointer font-semibold'>
                            <MdDelete className='text-xl' onClick={() => deletePassword(items.id)} />
                            <MdEdit className='text-xl' onClick={() => editPassword(items.id)} />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          </section>
        </section>
      </main>
      <ToastContainer />
    </>
  );
}

export default Manager;
