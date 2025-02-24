import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { NotesFormProp } from "../../TS_INTERFACE/gInterface";
import { removeNote } from "../../actions/AddNote";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const NoteCard = ({ note }: NotesFormProp) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = () => {
    if (note?.id) {
      dispatch(removeNote(note.id));
      navigate("/notes");
    } else {
      console.log("Entry not available to delete");
    }
  };

  return (
    <Card sx={{ maxWidth: 300, margin: "10px", boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {note?.title || "Untitled Note"}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {note?.noteSnippet || "No content available"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {note?.date ? new Date(note.date).toLocaleDateString() : "No date"}
        </Typography>

        {/* Edit & Remove Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <Button
            component={Link}
            to={`/edit/${note?.id}`}
            variant="outlined"
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
          <IconButton onClick={handleDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
