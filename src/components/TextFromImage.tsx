import { ChangeEvent, useState } from "react";
import Tesseract, { RecognizeResult, LoggerMessage } from "tesseract.js";
import {
   Box,
   HStack,
   Heading,
   Image,
   Input,
   Wrap,
   Button,
   WrapItem,
   Progress,
} from "@/components";

export const TextFromImage = () => {
   const [text, setText] = useState("");
   const [imagePath, setImagePath] = useState("");
   const [loading, setLoading] = useState<LoggerMessage | undefined>({
      progress: 0,
      jobId: "",
      status: "",
      userJobId: "",
      workerId: "",
   });

   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      setImagePath(URL.createObjectURL(file));
   };
   const getText = () => {
      Tesseract.recognize(imagePath, "eng", {
         logger: (m) => {
            // console.log("logger=> ", m);
            setLoading(m);
         },
      })
         .catch((err) => {
            console.error("Error=> ", err);
         })
         .then((result: RecognizeResult | void) => {
            // Get Confidence score
            console.log("result :>> ", result);
            if (result?.data) {
               setText(result?.data.text);
               setLoading(undefined);
            }
         });
   };
   return (
      <Box>
         <Box>
            <Heading textAlign="center">Get Text From Image</Heading>
         </Box>
         <HStack spacing={3} justify="center" w="100%" mt={3}>
            <Box textAlign="center">
               <Input onChange={handleChange} type="file" />
            </Box>
            <Box>
               <Button isLoading={!!loading?.progress} onClick={getText}>
                  GET TEXT
               </Button>
            </Box>
         </HStack>
         <Wrap spacing={1} justify="center">
            <WrapItem w="45%">
               <Image src={imagePath} pointerEvents="none" />
            </WrapItem>
            <WrapItem w="45%">
               <Box mt={2}>
                  {loading?.progress ? (
                     <Box>
                        <Box textAlign="center" color="blue">
                           {Math.floor(loading.progress * 100)}%
                        </Box>
                        <Progress value={loading.progress * 100} />
                        {loading.status}
                     </Box>
                  ) : (
                     <Box
                        background="#fff"
                        color="#333"
                        rounded={5}
                        textAlign="center"
                     >
                        {text}
                     </Box>
                  )}
               </Box>
            </WrapItem>
         </Wrap>
      </Box>
   );
};
