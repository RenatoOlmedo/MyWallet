import { useEffect, useState } from "react";
// import { EditorState } from 'draft-js';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import { Editor } from 'react-draft-wysiwyg';
import { RetornoModal } from "./RetornoModal";

export const ModalNews = ({onClose, open, typeProps, itemProps, mudanca}) =>{

    const[retornoModal, setRetornoModal] = useState({
        cor:"", 
        texto:"",
        open:false
    })
    const [modalOpen, setModalOpen] = useState(false)
    const [item, setItem] = useState(itemProps)
    var mudou = 0;

    const data = new Date();
      const [news, setNews] = useState({
        newsId:"",  
        title:"",
        body:"",
        year: data.getFullYear(),
        month: (data.getMonth() + 1)
      })
      

    
    useEffect(()=>{
        cleanNews()
        setItem(itemProps)
        setNews(itemProps)
    },[itemProps,typeProps, item])
    
    function fecharModal(){
        setModalOpen(false)
        onClose()
        cleanNews()
        mudanca()
    }

    async function handleSubmit(e, tipo){
        e.preventDefault();
        var textoOk = ""
        var textoRuim = ""
        switch(tipo){
            case "update":
                textoOk = "Noticia atualizada";
                textoRuim = "Erro ao atualizar notícia"
                break;
            case "add":
                 textoOk = "Noticia cadastrada";
                textoRuim = "Erro ao cadastar notícia"
                break;
            default:
                break;
        }
        console.log(news)
        const response = await fetch('/News',{
            method:tipo,
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(news)
        }
        )
        if(response.ok){
            setRetornoModal({cor:"success", texto:textoOk, open:true})
            setTimeout(function(){
                setRetornoModal({open:false})
            },2000)
            fecharModal()
            cleanNews()
            mudanca()
        }
        else{
            setRetornoModal({cor:"danger", texto:textoRuim, open:true})
            setTimeout(function(){
                setRetornoModal({open:false})
            },2000)
            fecharModal()
        }
    }

    async function DeleteNews(e){
        e.preventDefault();
        var response = await fetch('/News',{
            method:"DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(news.newsId)
        })
        if(response.ok){
            setRetornoModal({cor:"success", texto:"Noticia deletada", open:true})
            setTimeout(function(){
                setRetornoModal({open:false})
            },2000)
            fecharModal()
            cleanNews()
            mudanca()
        }else{
            setRetornoModal({cor:"danger", texto:"erro ao deletar noticia", open:true})
            setTimeout(function(){
                setRetornoModal({open:false})
            },2000)
            fecharModal()
        }
    }

    function cleanNews(){
        setNews({newsId:"",  
            title:"",
            body:""})
    }

    var retornoUpdate =  <><div><div className="col-12 text-end position-relative">
                    <div onClick={fecharModal} className="close"></div>
                </div>

                <div className="col-12 mt-5">
                <form onSubmit={(e) =>handleSubmit(e, 'PUT')}>
                    <div className=" col-12 mb-4">
                        <label htmlFor="tituloNews" className="form-label">Título da notícia</label>
                       <div>
                       <input required value={news.title} onChange={(e)=>{
                        setNews({...news,title:e.target.value})
                       }} id="tituloNews" type="text" className="form-control"></input> 
                       </div>
                    </div>
                  <div className="mb-3">
                    <label htmlFor="bodyNoticia" className="form-label">Corpo da notícia</label>
                    <textarea required className="form-control" id="bodyNoticia" value={news.body} onChange={(e)=>{
                        setNews({...news, body:e.target.value})
                    }}>

                    </textarea>
                  </div>
                    <div className="col-12 text-center">
                    <button type="submit" className="btn btn-primary">Salvar</button>
                    </div>
                   
                </form>
                </div>
    </div></>

var retornoAdd = <>{/* Modal ADD  */}
                <div className="col-12 text-end position-relative">
                    <div onClick={fecharModal} className="close"></div>
                </div>

                <div className="col-12 mt-5">
                <form onSubmit={(e) => handleSubmit(e, 'POST')}>
                    <div className=" col-12 mb-4">
                        <label htmlFor="tituloNews" className="form-label">Título da notícia</label>
                       <div>
                       <input required value={news.title} onChange={(e)=>{
                        setNews({...news,title:e.target.value})
                       }} id="tituloNews" type="text" className="form-control"></input> 
                       </div>
                    </div>
                  <div className="mb-3">
                    <label htmlFor="bodyNoticia" className="form-label">Corpo da notícia</label>
                    <textarea required className="form-control" id="bodyNoticia" value={news.body} onChange={(e)=>{
                        setNews({...news, body:e.target.value})
                    }}>

                    </textarea>
                  </div>
                    <div className="col-12 text-center">
                    <button type="submit" className="btn btn-primary">Salvar</button>
                    </div>
                   
                </form>
                </div>
    </>

var retornoDelete = <>
<div className="col-12 text-end position-relative">
                    <div onClick={fecharModal} className="close"></div>
                </div>
    <div className="col-12 text-center">
        <p>Tem certeza que deseja excluir a notícia?</p>
        <p><strong>{news.title}</strong></p>
        <button onClick={DeleteNews} className="btn btn-primary mt-3">Deletar</button>
    </div>
        </>


    var tipoModal = "";
    switch(typeProps){
        case "update":
            tipoModal = retornoUpdate;
            break;
        case "add":
            tipoModal = retornoAdd;
            break;
        case "delete":
            tipoModal = retornoDelete;
        default:
            break;
    } 
   

return (
    <>
    <RetornoModal corProps={retornoModal.cor} textoProps={retornoModal.texto} openProps={retornoModal.open}></RetornoModal>
        <div className={`modal ${open ? "" : 'fechada'}`}>
            <div class="fecha-modal" onClick={fecharModal}></div>
              <div className="container conteudo-modal p-lg-5 py-3">
              <div class="row justify-content-center">
                    {tipoModal}
                </div>
              </div>
        </div>
    </>
)
}