import { data } from "../constants";
import { saveTaskToFirestore } from "../services/firestoreService";

export function importAllDataToFirestore() {
  data.forEach((element) => {
    saveTaskToFirestore(element);
  });
}
