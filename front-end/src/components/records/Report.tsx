import React, { Dispatch, SetStateAction } from 'react';
import ReactPDF, {
  Page,
  Text,
  View,
  Document,
  Font,
  Image,
  PDFViewer,
} from '@react-pdf/renderer';
import { useAppContext } from 'features/AppContext';

import formatDate from 'utils/formatDate';
import { PDFStyles } from 'utils/PDFStyles';
interface PDFProps {
  ctextnicName?: string;
  currPatient: Patient;
  dateStamps: string[];
  images: ImageUpload[];
}
const PDF = ({ ctextnicName, currPatient, images, dateStamps }: PDFProps) => {
  return (
    <Document>
      <Page style={PDFStyles.body}>
        <Text style={PDFStyles.header} fixed>
          Cavity Quest
        </Text>
        <Text style={PDFStyles.title}>{ctextnicName}</Text>
        <Text style={PDFStyles.author}>Dental Health Report</Text>
        <View style={PDFStyles.twoColsP}>
          <View style={PDFStyles.patientInfo}>
            <Text>
              <Text style={PDFStyles.bold}>Patient name: </Text>
              {currPatient.fullName}
            </Text>

            <Text>
              <Text style={PDFStyles.bold}>Gender: </Text>
              {currPatient.gender}
            </Text>

            <Text>
              <Text style={PDFStyles.bold}>Birthdate: </Text>
              {formatDate(new Date(currPatient?.dateOfBirth))[0]}
            </Text>
          </View>
          <View>
            <Text>
              <Text style={PDFStyles.bold}>Contact number: </Text>
              {currPatient.contactNumber}
            </Text>
            <Text>
              <Text style={PDFStyles.bold}>Address: </Text>
              {currPatient.address}
            </Text>
          </View>
        </View>
        <Text style={PDFStyles.h2}>History</Text>
        <View style={PDFStyles.table}>
          <View style={PDFStyles.tableRow}>
            <View style={PDFStyles.tableCol}>
              <Text style={[PDFStyles.bold, PDFStyles.tableCell]}>Date</Text>
            </View>
            <View style={PDFStyles.tableCol}>
              <Text style={[PDFStyles.bold, PDFStyles.tableCell]}>
                Treatment
              </Text>
            </View>
            <View style={PDFStyles.tableCol}>
              <Text style={[PDFStyles.bold, PDFStyles.tableCell]}>
                Tooth Name
              </Text>
            </View>
            <View style={PDFStyles.tableCol}>
              <Text style={[PDFStyles.bold, PDFStyles.tableCell]}>
                Tooth Location
              </Text>
            </View>
            <View style={PDFStyles.tableCol}>
              <Text style={[PDFStyles.bold, PDFStyles.tableCell]}>Dentist</Text>
            </View>
          </View>
          {currPatient.history &&
            currPatient.history?.map((history, ind) => (
              <View key={ind} style={PDFStyles.tableRow}>
                <View style={PDFStyles.tableCol}>
                  <Text style={PDFStyles.tableCell}>{history.createdOn}</Text>
                </View>
                <View style={PDFStyles.tableCol}>
                  <Text style={PDFStyles.tableCell}>{history.treatment}</Text>
                </View>
                <View style={PDFStyles.tableCol}>
                  <Text style={PDFStyles.tableCell}>{history.toothName}</Text>
                </View>
                <View style={PDFStyles.tableCol}>
                  <Text style={PDFStyles.tableCell}>
                    {history.toothLocation}
                  </Text>
                </View>
                <View style={PDFStyles.tableCol}>
                  <Text style={PDFStyles.tableCell}>{history.dentist}</Text>
                </View>
              </View>
            ))}
        </View>
        <Text style={PDFStyles.h2}>Detections</Text>
        {[...dateStamps]?.reverse().map((date) => {
          return (
            <View>
              <Text style={PDFStyles.h2}>{date}</Text>
              {images.map(
                (img, index) =>
                  formatDate(new Date(img.createdOn.seconds * 1000))[0] ===
                    date && (
                    <>
                      <Image style={PDFStyles.detection} src={img.offlineUrl} />
                      {img.toothName && img.toothLocation && (
                        <Text>{img.toothLocation + '-' + img.toothName}</Text>
                      )}
                    </>
                  )
              )}
            </View>
          );
        })}

        <Text
          style={PDFStyles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};
interface ReportProps {
  dateStamps: string[];
  images: ImageUpload[];
  setIsReportOpen: Dispatch<SetStateAction<boolean>>;
}
const Report = ({ dateStamps, images, setIsReportOpen }: ReportProps) => {
  const { currClinic, currPatient } = useAppContext() as ContextType;
  return (
    <>
      <div className="absolute top-0 left-0 h-full w-full z-40 flex justify-center items-center">
        <PDFViewer className="w-[80%] h-[90%] z-40">
          <PDF
            ctextnicName={currClinic?.name}
            currPatient={currPatient!}
            dateStamps={dateStamps}
            images={images}
          />
        </PDFViewer>
        <div
          className="absolute h-full w-full z-[30] bg-black opacity-75 cursor-pointer"
          onClick={() => {
            setIsReportOpen(false);
            console.log('clckd');
          }}
        ></div>
      </div>
    </>
  );
};

export default Report;
