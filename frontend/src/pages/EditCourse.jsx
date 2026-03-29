import { useParams } from "react-router-dom";
import AddCourseForm from "../components/AddCourseForm";

export default function EditCourse() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-10">
      <AddCourseForm courseId={id} />
    </div>
  );
}
