import { useEffect, useState } from "react";
// import { EditorState } from 'draft-js';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import { Editor } from 'react-draft-wysiwyg';
import { RetornoModal } from "./RetornoModal";

export const ModalNews = ({onClose, open, typeProps, itemProps}) =>{

    const[retornoModal, setRetornoModal] = useState({
        cor:"", 
        texto:"",
        open:false
    })
    const [modalOpen, setModalOpen] = useState(open)
    const [item, setItem] = useState(itemProps)

    const data = new Date();
      const [news, setNews] = useState({
        title:"",
        body:"",
        year: data.getFullYear(),
        month: (data.getMonth() + 1)
      })
      

    
    useEffect(()=>{
        console.log(itemProps)
    },[itemProps])
    function fecharModal(){
        setModalOpen(false)
        onClose()
    }

    async function handleSubmit(e){
        e.preventDefault()
        console.log(news)
        const response = await fetch('/News',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(news)
        }
        )
        if(response.ok){
            setRetornoModal({cor:"success", texto:"Noticia cadastrada", open:true})
            setTimeout(function(){
                setRetornoModal({open:false})
            },2000)
        }
        else{
            setRetornoModal({cor:"danger", texto:"erro ao cadastrar noticia", open:true})
            setTimeout(function(){
                setRetornoModal({open:false})
            },2000)
        }
    }

    const tipoModal = typeProps == "update" ? 
    <>
        <div>
            <p>{item.id}</p>
        </div>
    </>

    :
    <>
    {/* Modal ADD  */}
    <div className="col-12 text-end position-relative">
                        <div onClick={fecharModal} className="close"></div>
                    </div>

                    <div className="col-12 mt-5">
                    <form onSubmit={handleSubmit}>
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