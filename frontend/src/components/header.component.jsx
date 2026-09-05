export const Header = ({icon="", title})=>{
    return(
         <div
            className="w-full py-3 border-b flex items-center gap-2"
            style={{ borderColor: "#e8ba8f", backgroundColor: "#bffff4" }}
            >
            {icon && (
                <img
                src={icon}
                alt={title}
                className="h-5 w-5 ml-4"
                />
            )}

            <span className="text-gray-800 font-medium">
                {title}
            </span>
            
            </div>
    )
}