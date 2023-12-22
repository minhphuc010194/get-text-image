import { ChangeEvent, useState, useRef } from "react";
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
   TableView,
   Container,
} from "@/components";
import { textToHtml, detectCurrency } from "@/services";
import { DataType } from "@/utils/types";

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
   // const canvasRef = useRef<HTMLCanvasElement>(null);
   const imageRef = useRef<HTMLImageElement>(null);
   const [data, setData] = useState<DataType[]>([]);

   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      setImagePath(URL.createObjectURL(file));
   };
   const getText = () => {
      // const canvas = canvasRef.current as HTMLCanvasElement;
      // const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      // ctx.drawImage(imageRef.current as HTMLImageElement, 0, 0);
      // ctx.putImageData(preprocessImage(canvas), 0, 0);
      // const dataUrl = canvas.toDataURL("image/jpeg");
      // console.log("dataUrl :>> ", dataUrl);

      Tesseract.recognize(imagePath, "eng", {
         logger: (m) => {
            setLoading(m);
         },
      })
         .catch((err) => {
            console.error("Error=> ", err);
         })
         .then((result: RecognizeResult | void) => {
            // Get Confidence score

            if (result?.data) {
               // console.log("result :>> ", result);
               const strs = result.data?.text.split("\n");
               const dataTemp: DataType[] = [];
               strs.map((str: string) => {
                  const item = detectCurrency(str);
                  if (item) {
                     dataTemp.push(item);
                  }
               });
               setData(dataTemp);
               setText(textToHtml(result?.data.text));
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
               <Input
                  onChange={handleChange}
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
               />
            </Box>
            <Box>
               <Button
                  colorScheme="blue"
                  isDisabled={!imagePath}
                  isLoading={!!loading?.progress}
                  onClick={getText}
                  loadingText={loading?.status + "..."}
               >
                  GET TEXT
               </Button>
            </Box>
         </HStack>
         <Wrap spacing={1}>
            <WrapItem w="45%">
               <Image ref={imageRef} src={imagePath} pointerEvents="none" />
            </WrapItem>
            {/* <WrapItem>
               <canvas ref={canvasRef} width={700} height={250} />
            </WrapItem> */}
            <WrapItem w="45%">
               <Box mt={2}>
                  {loading?.progress ? (
                     <Box w="200px">
                        <Box textAlign="center" color="blue">
                           {Math.floor(loading.progress * 100)}%
                        </Box>
                        <Progress
                           value={loading.progress * 100}
                           hasStripe
                           rounded={10}
                        />
                     </Box>
                  ) : (
                     <Box
                        height={250}
                        overflow="hidden"
                        textOverflow="ellipsis"
                        overflowY="auto"
                     >
                        {text && (
                           <Heading fontSize="smaller">Simple Text:</Heading>
                        )}

                        <Box
                           background="#fff"
                           color="#333"
                           rounded={5}
                           dangerouslySetInnerHTML={{ __html: text }}
                        />
                     </Box>
                  )}
               </Box>
            </WrapItem>
         </Wrap>
         <Box as="br" />
         {data.length > 0 && (
            <Container>
               <TableView data={data} />
            </Container>
         )}
      </Box>
   );
};
