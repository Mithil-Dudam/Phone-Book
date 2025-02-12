import React, { useEffect, useState } from "react";
import {Delete} from "lucide-react"
import api from "./api";
import {ChevronRight, ChevronLeft, Trash2, UserPen } from "lucide-react"

function App() {
  const [contactID,setContactID] = useState<number>(0)
  const [name,setName] = useState<string>("")
  const [number, setNumber] = useState<string>("");
  const [error,setError] = useState<string|null>(null)
  const [display,setDisplay] = useState<number>(0)
  const [flag,setFlag] = useState<number>(0)
  const [message,setMessage] = useState<string>("")
  const [contacts,setContacts] = useState<{id:number,name:string,number:string}[]>([])
  const [offset,setOffset] = useState(0)
  const limit=5
  const [totalContacts,setTotalContacts] = useState(0)

  const Keypad = (value:string) =>{
    if(value==="delete"){
      setNumber((prevNumber)=>prevNumber.slice(0,-1))
    }else{
    setNumber(prevNumber => prevNumber+value)
    setError(null)
    }
  }

  const AllContacts = async () =>{
    setError(null)
    try{
      const response = await api.get(`/view-all?offset=${offset}&limit=${limit}`)
      if(response.status === 200){
        setContacts(response.data.contacts)
        setTotalContacts(response.data.total_contacts)
      }
    }catch(error:any){
      console.error(error)
      setError("Error: Couldnt get contacts")
    }
  }

  useEffect(()=>{
    if(display===1){
      AllContacts()
    }
  },[offset])

  const totalPages = Math.ceil(totalContacts / limit)
  const currentPage = Math.floor(offset / limit) + 1

  const nextPage = () => {
    if (offset + limit < totalContacts) setOffset(offset + limit)
  }

  const prevPage = () => {
    if (offset - limit >= 0) setOffset(offset - limit)
  }

  const Create = async () =>{
    setError(null)
    setMessage("")
    setFlag(0)
    setDisplay(0)
    try{
      if(name===""){
        setError("Cant enter an empty name")
        return
      }
      if(number===""){
        setError("Cant enter an empty phone number")
        return
      }
      const response = await api.post("/create-contact",{name:name,number:number})
      if(response.status === 201){
        setMessage(response.data.message)
        setName("")
        setNumber("")
      }
    }catch(error:any){
      console.error(error)
      setError("Error: Couldnt create contact")
    }
  }

  const DeleteContact = async (ContactId:number) => {
    setError(null)

    try{
      const response = await api.post(`/delete/${ContactId}`)
      if(response.status===200){
        AllContacts()
      }
    }catch(error:any){
      console.error(error)
      setError("Error: Couldnt delete task")
    }
  }

  useEffect(()=>{
    if(message){
      const timer = setTimeout(() => setMessage(""), 2000);
      return () => clearTimeout(timer)
    }
  },[message])

  const EditContact = (Contact:{id:number,name:string,number:string}) => {
    setDisplay(0)
    setFlag(1)
    setContactID(Contact.id)
    setName(Contact.name)
    setNumber(Contact.number)
  }

  const UpdateContact = async (ContactId:number,name:string,number:string) =>{
    setError(null)
    setMessage("")

    if (name === ""){
      setError("Cant enter an empty name")
      return
    } 
    if(number === "") {
      setError("Cant enter an empty number");
      return;
    }

    try{
      const response = await api.post(`/update/${ContactId}`,{name,number})
      if(response.status === 200){
        setMessage(response.data.message)
        setName("")
        setNumber("")
        setFlag(0)
        setDisplay(1)
        AllContacts()
      }
    }catch(error:any){
      console.error(error)
      setError("Error: Couldnt create contact")
    }
  }

  return (
    <div className="bg-lime-100 min-w-screen min-h-screen flex items-center justify-center">
      <div className="flex">
        <div className="w-full px-5 border items-center justify-center flex flex-col bg-black rounded-3xl">
          {display===0 &&(
            <div className="w-full">
              <div className="border-white border-2 mt-10 mb-5 mx-5 pt-5 w-[94%] grid pl-5 rounded-3xl">
                <label className="text-sm text-white">{flag === 0 ? "Enter Name":"Edit Name"}</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={`w-[90%] border-white border focus:border-white ml-2 pl-2 mb-5 text-white placeholder-red-500`}
                placeholder={error ? "Must enter a name":""}/>
                <p className="text-sm text-white">{flag === 0 ? "Enter Number":"Edit Number"}</p>
                <p className={`pl-2 border-white border w-[90%] mb-5 ml-2 ${error ? "text-red-500":"text-white"}`}>{number ||error|| "Use the keypad"}</p>
              </div>
              <div className="flex flex-col flex-grow py-20">
                {message && (<p className="text-green-500 border-white border-2 mx-30 font-semibold rounded-3xl py-1 text-center">{message}</p>)}
              </div>
              <div className="mb-10 text-white">
                <table className="cursor-pointer">
                  <tbody>
                    <tr>
                      <td className="px-20 py-1 border border-gray-400"
                          onClick={() =>
                            Keypad("1")
                          }>
                        1
                      </td>
                      <td className="px-20 py-1 border border-gray-400"
                          onClick={() => 
                            Keypad("2")
                          }>
                          2
                      </td>
                      <td className="px-20 py-1 border border-gray-400" onClick={() => 
                            Keypad("3")
                          }>
                          3
                      </td>
                    </tr>
                    <tr>
                      <td className="px-20 py-1 border border-gray-400" onClick={() => 
                            Keypad("4")
                          }>
                          4
                      </td>
                      <td className="px-20 py-1 border border-gray-400" onClick={() => 
                            Keypad("5")
                          }>
                          5
                      </td>
                      <td className="px-20 py-1 border border-gray-400" onClick={() => 
                            Keypad("6")
                          }>
                          6
                      </td>
                    </tr>
                    <tr>
                      <td className="px-20 py-1 border border-gray-400" onClick={() => 
                            Keypad("7")
                          }>
                          7
                      </td>
                      <td className="px-20 py-1 border border-gray-400" onClick={() => 
                            Keypad("8")
                          }>
                          8
                      </td>
                      <td className="px-20 py-1 border border-gray-400" onClick={() => 
                            Keypad("9")
                          }>
                          9
                      </td>
                    </tr>
                    <tr>
                      <td className=" pl-18 border border-gray-400"  onClick={() => 
                            Keypad("delete")
                          }>
                        <Delete size={20} />
                      </td>
                      <td className="text-center px-20 py-1 border border-gray-400"  onClick={() => 
                            Keypad("0")
                          }>
                          0
                      </td>
                      <td className="text-center py-1 border border-gray-400" onClick={()=>(flag===0? Create():UpdateContact(contactID,name,number))}>
                        Save
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {display===1 && (
            <div className="w-[500px]">
              <table className="table-fixed border-collapse border border-gray-300 text-white mt-10">
              <tbody>
                {contacts.length > 0 ? (
                contacts.map((contact) => (
                <tr key={contact.id} className="border-b border-gray-300">
                  <td className="border border-gray-300 px-4 py-2 w-[70%]">{contact.name}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center w-[15%]">{contact.number}</td>
                  <td className="border border-gray-300 px-4 py-2 w-[15%]">
                    <div className="flex justify-center">
                      <button 
                      onClick={() => EditContact(contact)} 
                      className="  border-green-600 border-2 px-3 py-1 rounded mr-5 hover:bg-green-500 hover:text-white cursor-pointer"
                      >
                      <UserPen />
                      </button>
                      <button 
                      onClick={() => DeleteContact(contact.id)} 
                      className="  px-3 py-1 rounded border-red-500 border-2 hover:bg-red-500 hover:text-white cursor-pointer"
                      >
                      <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center text-gray-500 py-4">No Contacts.</td>
                </tr>
              )}
              </tbody>
              </table>
              <div className='flex justify-between items-center my-3 px-5 text-white'>
              <div>
                <span className="font-semibold">Showing Page <span className='font-bold text-lg'>{currentPage}</span> out of <span className='font-bold text-lg'>{totalPages}</span></span>
              </div>
              <div className="items-center">
                <button onClick={prevPage} disabled={offset === 0} className="px-4 py-2 mx-2 disabled:opacity-50 cursor-pointer"><ChevronLeft/></button>
                <button onClick={nextPage} disabled={offset + limit >= totalContacts} className="px-4 py-2 mx-2 disabled:opacity-50 cursor-pointer"><ChevronRight/></button>
              </div>
            </div>
            </div>
          )}   
        </div>
        <div className="w-full">
          <h1 className="border mt-10 text-2xl font-semibold bg-amber-800 cursor-pointer" onClick={()=>setDisplay(1)}>PhoneBook</h1>
          <h1 className="border mt-10 w-full text-2xl font-semibold bg-amber-800 cursor-pointer" onClick={Create}>Add Contact</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
