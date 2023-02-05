
export interface UploadFile {
    filename: string;
    content: Blob;
}

// Note: There is NO standard way to detect whether the user has clicked Cancel button for File Upload
// I use a hacky solution for this that might not work everywhere
export class UploadHelper {

    static async triggerFileUpload(accept?: string): Promise<UploadFile | null> {
        return new Promise<UploadFile | null>((resolve, reject) => {
            const domUpload = document.createElement("input");
            domUpload.type = "file";
            if(accept !== undefined)
                domUpload.accept = accept;

            domUpload.onchange = async () => {
                if(domUpload.files === null || domUpload.files.length === 0) {
                    resolve(null)
                } else {
                    const filename = domUpload.files[0].name;
                    const content = await domUpload.files[0].arrayBuffer()
                    const blobContent = new Blob([content]);
                    resolve({filename, content: blobContent});
                }
            };

            // Hacky solution to detect, the file upload was cancelled
            // URL: https://www.geeksforgeeks.org/how-to-detect-when-cancel-is-clicked-on-file-input-using-javascript/
            const handleBodyFocus = () => {
                document.body.onfocus = null;               
                // We need to wait for the update of domUpload for some reason also
                setTimeout(() => {
                    if(domUpload.files === null || domUpload.files.length === 0) {
                        resolve(null);
                    }    
                }, 5000);
            };
            document.body.onfocus = handleBodyFocus;

            domUpload.click();
        });
    }
}
