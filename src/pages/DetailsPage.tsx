import { useParams } from "react-router-dom";


const DetailsPage = () => {
    const { projectId } = useParams<{ projectId: string }>();
    console.log("Project ID:", projectId); 
  return (
    <><h1>grrefewrfrew</h1></>
  )
}

export default DetailsPage