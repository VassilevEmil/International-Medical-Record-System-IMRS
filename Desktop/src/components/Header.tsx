import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { FaPlus, FaList } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";

const Header: React.FC = () => {
  const { selectedInstitution, patientData } = useAppContext();
  const isPatientAndInstitutionSelected =
    !!patientData && !!selectedInstitution;

  return (
    <AppBar
      position="static"
      sx={{
        borderRadius: 2,
        marginBottom: 2,
      }}
    >
      <Toolbar
        sx={{ justifyContent: "space-between", padding: 1, borderRadius: 2 }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              component="svg"
              viewBox="0 0 430 430"
              sx={{
                marginRight: 2,
                width: 50,
                height: 50,
              }}
            >
              <rect width="430" height="430" rx="100" fill="#fff" />
              <rect
                id="CrossCollorDiagonal"
                x="130"
                y="50"
                width="170"
                height="330"
                rx="20"
                fill={
                  selectedInstitution ? selectedInstitution.color : "#808080"
                }
              />
              <rect
                id="CrossCollorHorizontal"
                x="130"
                y="50"
                width="170"
                height="330"
                rx="20"
                transform="translate(1.75 430) rotate(-90)"
                fill={
                  selectedInstitution ? selectedInstitution.color : "#808080"
                }
              />
              <rect
                id="CrossMiddleHorizontal"
                x="180"
                y="100"
                width="70"
                height="230"
                fill="#fff"
              />
              <rect
                id="CrossMiddleDiagonal"
                x="180"
                y="100"
                width="70"
                height="230"
                transform="translate(1.75 430) rotate(-90)"
                fill="#fff"
              />
            </Box>
            <Typography variant="h6" color="inherit" sx={{ color: "white" }}>
              {selectedInstitution ? selectedInstitution.name : "EHRS System"}
            </Typography>
          </Link>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ marginRight: 2, color: "white" }}>
            Patient:{" "}
            {patientData
              ? `${patientData.patientFirstName} ${patientData.patientLastName}`
              : "No Patient Selected"}
          </Typography>
          <Button
            color="inherit"
            component={Link}
            to={isPatientAndInstitutionSelected ? "/addRecord" : "#"}
            disabled={!isPatientAndInstitutionSelected}
            sx={{
              marginRight: 2,
              color: isPatientAndInstitutionSelected
                ? "inherit"
                : "rgba(255, 255, 255, 0.3)",
              cursor: isPatientAndInstitutionSelected
                ? "pointer"
                : "not-allowed",
            }}
          >
            <FaPlus style={{ marginRight: 8 }} /> Add Record
          </Button>
          <Button
            color="inherit"
            component={Link}
            to={isPatientAndInstitutionSelected ? "/viewRecords" : "#"}
            disabled={!isPatientAndInstitutionSelected}
            sx={{
              color: isPatientAndInstitutionSelected
                ? "inherit"
                : "rgba(255, 255, 255, 0.3)",
              cursor: isPatientAndInstitutionSelected
                ? "pointer"
                : "not-allowed",
            }}
          >
            <FaList style={{ marginRight: 8 }} /> View Records
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
