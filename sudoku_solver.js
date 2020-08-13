fn main() {
    let mut wildcatjan17 = [
        [0,0,0,2,6,0,7,0,1],
        [6,8,0,0,7,0,0,9,0],
        [1,9,0,0,0,4,5,0,0],
        [8,2,0,1,0,0,0,4,0],
        [0,0,4,6,0,2,9,0,0],
        [0,5,0,0,0,3,0,2,8],
        [0,0,9,3,0,0,0,7,4],
        [0,4,0,0,5,0,0,3,6],
        [7,0,3,0,1,8,0,0,0]
    ];
    let wildcatjan17_solved = [
        [4,3,5,2,6,9,7,8,1],
        [6,8,2,5,7,1,4,9,3],
        [1,9,7,8,3,4,5,6,2],
        [8,2,6,1,9,5,3,4,7],
        [3,7,4,6,8,2,9,1,5],
        [9,5,1,7,4,3,6,2,8],
        [5,1,9,3,2,6,8,7,4],
        [2,4,8,9,5,7,1,3,6],
        [7,6,3,4,1,8,2,5,9]
    ];
    solve_board(&mut wildcatjan17);
    let check = check_win(wildcatjan17_solved);
    println!("Win: {}", check);
    for i in 0..9 {
        println!("{:?}", wildcatjan17_solved[i]);
    }
}
fn check_valid(board: [[i32; 9]; 9]) -> bool { 
    for i in 0..9 {
        for j in 0..9 {
            for k in 0..9 {
                if board[i][j] != 0 && board[i][j] == board[i][k] {
                    return false;
                }
                if board[j][i] != 0 && board[j][i] == board[k][j] {
                    return false;
                }
            }
        }
    }
    return true;
}

fn check_win(board: [[i32; 9]; 9]) -> bool { 
    for n in 1..10 {
        for i in 0..9 {
            let mut pass_horizontal = false;
            let mut pass_vertical = false;
            for j in 0..9 {
                if board[i][j] == n {
                    pass_horizontal = true;
                }
                if board[j][i] == n {
                    pass_vertical = true;
                }
            }
            if !pass_horizontal || !pass_vertical {
                return false;
            }
        }

        for h in 0..3 {
            let mut pass_left = false;
            let mut pass_middle = false;
            let mut pass_right = false;
            for i in 0..3 {
                for j in 0..3 {
                    if board[i+3*h][j] == n {
                        pass_left = true;
                        print!("Found {} at ({},{})\t", n, i+3*h, j);
                    } 
                    if board[i+3*h][j+3] == n {
                        pass_middle = true;
                        print!("Found {} at ({},{})\t", n, i+3*h, j+3);
                    } 
                    if board[i+3*h][j+6] == n {
                        pass_right = true;
                        print!("Found {} at ({},{})\t", n, i+3*h, j+6);
                    } 
                }
            }
            if !pass_left || !pass_middle || !pass_right {
                return false;
            }
            print!("\n");
        }
 
    }
    return true;
}

fn solve_board(board: &mut [[i32; 9]; 9]) {
}
