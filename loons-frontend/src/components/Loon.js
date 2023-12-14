import React from "react"

function Loon({id,position}){
    return(
    <p style={{
        position: "absolute",
        left: `${window.innerWidth / 2+position.position_x}px`,
        top: `${window.innerHeight / 2+position.position_y}px`,
    }}>
        L
    </p>
    )
}

export default Loon