import { useEffect, useState } from "react"


export const ModalWallet = ({userProps, open,onClose}) =>{

    const [userSe, setUser] = useState(userProps);
    const [opened, setOpened] = useState(open);
    const [carregado,setCarregado] = useState(false)

    useEffect(()=>{
        setOpened(open)
    },[open])
    function fecharModal(){
        setOpened(false)
        onClose()
    }

    return (
        <>
           <div class={`modal ${opened ? '' : 'fechada'}`}>
            <div class="fecha-modal" onClick={fecharModal}></div>
                <div class="container conteudo-modal p-5">
                   {carregado ? 
                    <div class="row justify-content-center">
                        <div class="col-12">
                            <h1 className="text-center">Título Modal</h1>
                        </div>
                    </div>
                    :

                    <div class="row justify-content-center align-items-center h-100">
                        <div class="col-12 text-center">
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                }
                </div>
           </div>
        </>
    )

}