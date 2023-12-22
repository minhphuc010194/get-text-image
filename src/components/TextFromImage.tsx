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
} from "@/components";
import { textToHtml } from "@/services";

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
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const imageRef = useRef<HTMLImageElement>(null);

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
               <Button isLoading={!!loading?.progress} onClick={getText}>
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
                     <Box>
                        <Box textAlign="center" color="blue">
                           {Math.floor(loading.progress * 100)}%
                        </Box>
                        <Progress
                           value={loading.progress * 100}
                           hasStripe
                           rounded={10}
                        />
                        {loading.status}
                     </Box>
                  ) : (
                     <Box>
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
      </Box>
   );
};
