import { useParams } from "react-router-dom";


const MembersPage = () => {
    const { projectId } = useParams<{ projectId: string }>();
    console.log("Project ID:", projectId); 
  return (
    <><h1>grrefewrfrew</h1></>
  )
}

export default MembersPage