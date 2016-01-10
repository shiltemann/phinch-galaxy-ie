<?php
$pipeDescriptions = array(
   0 => array("pipe", "r"),  // stdin is a pipe that the child will read from
   1 => array("pipe", "w"),  // stdout is a pipe that the child will write to
   2 => array("pipe", "w") // stderr is also a pipe
);
if(!isset($_POST['fname'])) {
    die(json_encode(array('error' => 'no svg data')));
}

//mamp work arounds :( 
//$_ENV['PATH'] = '/opt/local/bin:/opt/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/opt/X11/bin:/usr/local/git/bin:/Users/pitchmini/bin/FDK/Tools/osx';
//unset($_ENV['DYLD_LIBRARY_PATH']);

$biomdata = $_POST['fname'];
if(get_magic_quotes_gpc()) {
    $svg = stripslashes($svg);
}


//save biom data to file
$fh_biom = fopen("export.biom", 'w') or die("can't open file");
fwrite($fh_biom,$biomdata);
fclose($fh_biom);

//SH: send to galaxy
$process = proc_open('python /usr/bin/galaxy.py --action put --argument export.biom', $pipeDescriptions, $pipes, NULL);
$return_value = proc_close($process);


?>