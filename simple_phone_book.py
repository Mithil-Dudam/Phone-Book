# Phone Book

from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List,Annotated

from sqlalchemy import create_engine, asc
from sqlalchemy.orm import sessionmaker

from sqlalchemy import Column, Integer, String

from sqlalchemy.orm import Session,declarative_base

app=FastAPI()

origins = ['http://localhost:5173']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

URL_db = 'postgresql://postgres:password@localhost:5432/PhoneBook' 

engine = create_engine(URL_db)
sessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=engine)
Base=declarative_base()

class Contact(BaseModel):
    name:str
    number:str

class PhoneBook(Base):
    __tablename__ = "PhoneBook"
    id = Column(Integer,primary_key=True,index=True)
    name = Column(String,index=True)
    number = Column(String,index=True)

Base.metadata.create_all(bind=engine)

def get_db():
    db=sessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency=Annotated[Session,Depends(get_db)]

@app.post("/create-contact",status_code=status.HTTP_201_CREATED)
async def create_contact(user:Contact,db:db_dependency):
    db_user = PhoneBook(name=user.name,number=user.number)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message":"Contact created Successfully"}

@app.get("/view-all",status_code=status.HTTP_200_OK)
async def view_all(db:db_dependency,offset:int=0,limit:int=5):
    contacts = db.query(PhoneBook).order_by(asc(PhoneBook.id)).offset(offset).limit(limit).all()
    total_contacts = db.query(PhoneBook).count()
    return {"contacts":contacts,"total_contacts":total_contacts}

@app.post("/update/{contact_id}",status_code=status.HTTP_200_OK)
async def update(user:Contact,contact_id:int,db:db_dependency):
    contact = db.query(PhoneBook).filter(PhoneBook.id == contact_id).first()
    contact.name= user.name
    contact.number = user.number
    db.commit()
    db.refresh(contact)
    return {"message":"Contact updated successfully"}

@app.post("/delete/{contact_id}",status_code=status.HTTP_200_OK)
async def delete(contact_id:int,db:db_dependency):
    contact = db.query(PhoneBook).filter(PhoneBook.id == contact_id).first()
    db.delete(contact)
    db.commit()
    return {"message":"Contact deleted successfully"}