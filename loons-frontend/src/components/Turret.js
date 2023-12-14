const Turret = ({position}) => {
    return(
        <p style={{position:'absolute',top:`${position.y}px`,left:`${position.x}px`}}>
            T
        </p>
    )
}

export default Turret