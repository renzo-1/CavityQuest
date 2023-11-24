import { StyleSheet, Font } from '@react-pdf/renderer';
Font.register({
  family: 'Helvetica',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf',
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf',
      fontWeight: 600,
    },
  ],
});
export const PDFStyles = StyleSheet.create({
  body: {
    zIndex: 1000,
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Helvetica',
  },
  author: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 14,
    fontFamily: 'Helvetica',
  },
  text: {
    margin: 14,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Helvetica',
  },
  detection: {
    marginVertical: 10,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 14,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
  patientInfo: {
    display: 'flex',
    fontSize: 14,
  },
  twoColsP: {
    flex: 1,
    flexDirection: 'row',
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 14,
    maxHeight: '70px',
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
  history: {
    flexDirection: 'row',
    flex: 1,
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    maxHeight: '20px',
  },
  cell: { maxWidth: '40%' },
  h2: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginTop: 20,
  },
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  table: {
    marginBottom: 20,
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 10,
  },
});
