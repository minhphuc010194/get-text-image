import { Box, Table, Tbody, Th, Thead, Tr, Td } from "@/components";
import { DataType } from "@/utils/types";

type TableViewTypes = {
   data: DataType[];
};
export const TableView = ({ data }: TableViewTypes) => {
   return (
      <>
         <Table variant="simple">
            <Thead bg="gray.100">
               <Tr>
                  <Th>STT</Th>
                  <Th>Food</Th>
                  <Th>Price</Th>
               </Tr>
            </Thead>
            <Tbody>
               {data?.map((item, idx) => (
                  <Tr key={idx}>
                     <Td>{idx + 1}</Td>
                     <Td>{item.food}</Td>
                     <Td>{item.price + item.currency?.[0]}</Td>
                  </Tr>
               ))}
            </Tbody>
         </Table>
      </>
   );
};
