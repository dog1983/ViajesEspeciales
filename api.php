<?php
header('Content-Type: application/json');

$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'transporte';

$mysqli = new mysqli($host, $user, $pass, $dbname);
if ($mysqli->connect_error) {
    die(json_encode(['error' => 'Error de conexión']));
}

$accion = $_GET['accion'] ?? '';
$tabla  = $_GET['tabla']  ?? '';
$id     = $_GET['id']     ?? null;

// Función para ejecutar SELECT con posibles filtros
function select($mysqli, $tabla, $filtros = []) {
    $sql = "SELECT * FROM $tabla";
    if (!empty($filtros)) {
        $conditions = [];
        foreach ($filtros as $campo => $valor) {
            $conditions[] = "$campo = '" . $mysqli->real_escape_string($valor) . "'";
        }
        $sql .= ' WHERE ' . implode(' AND ', $conditions);
    }
    $res = $mysqli->query($sql);
    if (!$res) return ['error' => $mysqli->error];
    $data = [];
    while ($row = $res->fetch_assoc()) $data[] = $row;
    return $data;
}

// Login personalizado
if ($accion === 'login') {
    $input = json_decode(file_get_contents('php://input'), true);
    $usuario = $mysqli->real_escape_string($input['usuario']);
    $password = $mysqli->real_escape_string($input['password']);
    $res = $mysqli->query("SELECT * FROM usuarios WHERE usuario='$usuario' AND contraseña='$password'");
    if ($res && $row = $res->fetch_assoc()) {
        echo json_encode(['data' => $row]);
    } else {
        echo json_encode(['data' => null]);
    }
    exit;
}

// Para SELECT con filtros (vienen en POST como JSON)
if ($accion === 'select') {
    $filtros = [];
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $body = json_decode(file_get_contents('php://input'), true);
        $filtros = $body['filtros'] ?? [];
    }
    $data = select($mysqli, $tabla, $filtros);
    echo json_encode(['data' => $data]);
    exit;
}

// INSERT
if ($accion === 'insert') {
    $datos = json_decode(file_get_contents('php://input'), true);
    $campos = array_keys($datos);
    $valores = array_map(function($v) use ($mysqli) { return "'" . $mysqli->real_escape_string($v) . "'"; }, array_values($datos));
    $sql = "INSERT INTO $tabla (" . implode(',', $campos) . ") VALUES (" . implode(',', $valores) . ")";
    if ($mysqli->query($sql)) {
        echo json_encode(['data' => ['id' => $mysqli->insert_id]]);
    } else {
        echo json_encode(['error' => $mysqli->error]);
    }
    exit;
}

// UPDATE
if ($accion === 'update') {
    if (!$id) { echo json_encode(['error' => 'Falta ID']); exit; }
    $datos = json_decode(file_get_contents('php://input'), true);
    $sets = [];
    foreach ($datos as $campo => $valor) {
        $sets[] = "$campo = '" . $mysqli->real_escape_string($valor) . "'";
    }
    $sql = "UPDATE $tabla SET " . implode(',', $sets) . " WHERE id = " . intval($id);
    if ($mysqli->query($sql)) {
        echo json_encode(['data' => ['id' => $id]]);
    } else {
        echo json_encode(['error' => $mysqli->error]);
    }
    exit;
}

// DELETE
if ($accion === 'delete') {
    if (!$id) { echo json_encode(['error' => 'Falta ID']); exit; }
    $sql = "DELETE FROM $tabla WHERE id = " . intval($id);
    if ($mysqli->query($sql)) {
        echo json_encode(['data' => ['success' => true]]);
    } else {
        echo json_encode(['error' => $mysqli->error]);
    }
    exit;
}

echo json_encode(['error' => 'Acción no válida']);
