import React, { useEffect, useState } from "react";
import {
  Dimensions,
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import ImageZoom from "react-native-image-pan-zoom";
import { useRoute } from "@react-navigation/native";
import GetFileService from "../services/GetFileService";
import Pdf from "react-native-pdf";

const FileViewScreen = () => {
  const route = useRoute();
  const { recordId, fileId } = route.params;
  const [fileContent, setFileContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [screenDimensions, setScreenDimensions] = useState({
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  });

  useEffect(() => {
    const onChange = () => {
      setScreenDimensions({
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
      });
    };

    const subscription = Dimensions.addEventListener("change", onChange);
    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    const fetchFile = async () => {
      setIsLoading(true);
      try {
        const response = await GetFileService.getFile(recordId, fileId);
        if (response.success && response.data) {
          setFileContent({
            url: response.data,
            mimeType: response.mimeType.split(";")[0],
          });
        } else {
          console.log("Server responded with an error status");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFile();
  }, [recordId, fileId]);

  const renderFile = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }
    if (!fileContent) {
      return <Text>File cannot be displayed.</Text>;
    }
    if (fileContent.mimeType.startsWith("image/")) {
      return (
        <ImageZoom
          cropWidth={screenDimensions.width}
          cropHeight={screenDimensions.height}
          imageWidth={screenDimensions.width}
          imageHeight={screenDimensions.width}
        >
          <Image
            resizeMode="contain"
            style={{
              width: screenDimensions.width,
              height: screenDimensions.width,
            }}
            source={{ uri: fileContent.url }}
          />
        </ImageZoom>
      );
    } else if (fileContent.mimeType === "application/pdf") {
      return (
        <Pdf
          source={{ uri: fileContent.url, cache: true }}
          style={{
            flex: 1,
            width: screenDimensions.width,
            height: screenDimensions.height,
          }}
        />
      );
    } else {
      return <Text>Unsupported file type.</Text>;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderFile()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default FileViewScreen;
